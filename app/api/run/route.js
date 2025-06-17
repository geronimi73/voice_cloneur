const RP_ENDPOINT = process.env.RP_ENDPOINT
const RP_API_KEY = process.env.RP_API_KEY

export async function POST(request) {
  try {
    const { prompt, yt_url } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    } else if (!yt_url) {
      return Response.json({ error: "YouTube URL is required" }, { status: 400 })
    }

    const requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RP_API_KEY
      },
      body: JSON.stringify({
        input: { prompt: prompt, yt_url: yt_url }
      })
    };
    const url = "https://api.runpod.ai/v2/" + RP_ENDPOINT + "/run";
    const response = await fetch(url, requestConfig);
    let data = await response.json();   

    console.log("Client: ")
    console.log(data)

    if (data.status == "IN_QUEUE" && data.id) {
      return Response.json({ 
        rp_id: data.id,
        rp_status: data.status,
        status: 200
      })
    } else {
      return Response.json({ 
        error: "Unexpected response." ,
        status: 500 
      })
    }
  }

  catch (error) {
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

