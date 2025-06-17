const RP_ENDPOINT = process.env.RP_ENDPOINT
const RP_API_KEY = process.env.RP_API_KEY

export async function POST(request) {
  try {
    const { rp_id } = await request.json()

    const requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RP_API_KEY
      },
      body: {}
    };
    const url = "https://api.runpod.ai/v2/" + RP_ENDPOINT + "/status/" + rp_id;
    const response = await fetch(url, requestConfig);
    let data = await response.json();   

    console.log("API status: ")
    console.log(data)

    if (data.status == "COMPLETED" && data.output) {
      return Response.json({ 
        rp_id: data.id,
        rp_status: data.status,
        output: data.output,
        status: 200
      })
    } else if (data.status == "IN_QUEUE"
      || data.status == "IN_PROGRESS") {
      return Response.json({ 
        rp_id: data.id,
        rp_status: data.status,
        status: 200
      })
    } else {
      return Response.json({ 
        rp_id: data.id,
        rp_status: data.status,
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

