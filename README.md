Simple voice cloning with Next.JS, [chatterbox](https://huggingface.co/ResembleAI/chatterbox) and RunPod Serverless.

# Setup

* Deploy my [Chatterbox Serverless Endpoint](https://github.com/geronimi73/runpod_chatterbox) on RunPod
* Clone this repo

```bash
git clone https://github.com/geronimi73/runpod_chatterbox
```

* Add your RunPod API key and ID of your serverless endpoint to `.env` like this:
```
RP_ENDPOINT = "XXX"
RP_API_KEY = "XXX"
```
* Start

```bash
npm run dev
```

Go to `http://localhost:3000`:

<img width="662" alt="Screenshot 2025-06-23 at 19 24 00" src="https://github.com/user-attachments/assets/5e1f4225-dd7b-47af-9fe5-5d01afed1181" />

# Workflow
* `voice_cloneur` uses 2 API routes to talk to the RunPod endpoint
* `/api/run`: takes a prompt and YouToube URL and forwards these strings to the endpoint, it returns a job `id`
* `/api/status`: fetches the current status of a job by `id` and eventually the final base64 encoded audio data
* RunPod API key and serverless endpoint ID stay on the server only and are never shown to the client
* `components/voice-cloner` is the main client component collecting inputs, posting jobs to the API routes and displaying the in an HTML `audio` tag.
* once a job is submitted, the client polls `/api/status` every second for updates

# Samples

https://github.com/user-attachments/assets/f43ac0d1-38f9-4a14-9981-b0b741ff6c04

https://github.com/user-attachments/assets/1c70fc76-3f9d-4dc2-9595-3aa730e4e559

https://github.com/user-attachments/assets/999d58f8-7a6f-401a-852f-8b11a47820e5


