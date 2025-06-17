const RP_ENDPOINT = process.env.RP_ENDPOINT
const RP_API_KEY = process.env.RP_API_KEY

export async function POST(request) {
  try {
    const { prompt, yt_url } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }
    if (!yt_url) {
      return Response.json({ error: "YouTube URL is required" }, { status: 400 })
    }

    // console.log(`Forwarding request to Python API: ${PYTHON_API_URL}`)
    // console.log(`Payload: { input: { prompt: "${prompt}", yt_url: "${yt_url}" } }`)

    // const apiResponse = await fetch(PYTHON_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     input: {
    //       prompt: prompt,
    //       yt_url: yt_url,
    //     },
    //   }),
    // })
    // console.log(response.data);
    // console.log("Python API raw response status:", apiResponse.status)
    // console.log("Python API raw response body:", responseText)

    const requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RP_API_KEY
      },
      body: JSON.stringify({
        "input": {
          "prompt": prompt,
          "yt_url": yt_url,
        }
      })
    };
    const url = "https://api.runpod.ai/v2/" + RP_ENDPOINT + "/runsync";
    const response = await fetch(url, requestConfig);
    let data = await response.json();   

    console.log("API RESPONSE")
    console.log(data)

    data = data.output

    // const responseText = await apiResponse.text() // Read response as text first for debugging

    // if (!apiResponse.ok) {
    //   // Try to parse as JSON if possible, otherwise use text
    //   let errorDetails = responseText
    //   try {
    //     errorDetails = JSON.parse(responseText)
    //   } catch (e) {
    //     // Not JSON, use raw text
    //   }
    //   console.error("Python API error:", errorDetails)
    //   return Response.json(
    //     {
    //       error: `Voice cloning API request failed: ${apiResponse.statusText}`,
    //       details: errorDetails,
    //     },
    //     { status: apiResponse.status },
    //   )
    // }

    // If response is OK, try to parse as JSON
    // let data
    // try {
    //   data = JSON.parse(responseText)
    //   data = data.output
    // } catch (e) {
    //   console.error("Failed to parse Python API JSON response:", e)
    //   return Response.json(
    //     { error: "Invalid JSON response from voice cloning API", details: responseText },
    //     { status: 500 },
    //   )
    // }

    if (data && data.audio_base64) {
      return Response.json({ audio_base64: data.audio_base64, metadata: data.metadata })
    } else {
      console.error("Unexpected response structure from Python API:", data)
      return Response.json(
        { error: "Unexpected response structure from voice cloning API. Missing audio_base64." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in /api/clone-voice Next.js route:", error)
    // Check if it's a fetch error (e.g. network issue)
    if (error.cause && error.cause.code) {
      return Response.json(
        {
          error: `Network error when trying to reach voice cloning API: ${error.message}`,
          details: `Is the API at ${PYTHON_API_URL} running and accessible?`,
        },
        { status: 503 },
      ) // Service Unavailable
    }
    return Response.json({ error: "Internal Server Error in Next.js route.", details: error.message }, { status: 500 })
  }
}
