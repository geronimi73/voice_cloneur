"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, PlayCircle } from "lucide-react"

export default function VoiceCloner() {
  const [prompt, setPrompt] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/shorts/jcNzoONhrmE")
  const [audioSrc, setAudioSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setAudioSrc(null)

    if (!prompt.trim() || !youtubeUrl.trim()) {
      setError("Please provide both a text prompt and a YouTube URL.")
      return
    }

    // Basic YouTube URL validation (can be improved)
    try {
      const url = new URL(youtubeUrl)
      if (!["www.youtube.com", "youtube.com", "youtu.be"].includes(url.hostname)) {
        throw new Error("Invalid hostname")
      }
    } catch (e) {
      setError("Please enter a valid YouTube URL.")
      console.error(e.toString())
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/clone-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, yt_url: youtubeUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (data.audio_base64) {
        setAudioSrc(`data:audio/wav;base64,${data.audio_base64}`)
      } else {
        throw new Error("No audio data received from API.")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.")
      console.error("Cloning error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Generate Cloned Audio</CardTitle>
        <CardDescription className="text-slate-400">Provide text and a YouTube voice sample.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="youtube-url" className="text-slate-300">
              YouTube Voice Sample URL
            </Label>
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-slate-300">
              Text Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Enter the text you want the cloned voice to say..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Clone Voice 
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {error && (
        <CardFooter className="flex-col items-start space-y-2">
          <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
            <AlertTriangle className="h-4 w-4 !text-red-400" />
            <AlertTitle className="text-red-300">Error</AlertTitle>
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
      {audioSrc && !error && (
        <CardFooter className="flex-col items-center space-y-3 pt-6">
          <h3 className="text-lg font-medium text-slate-200">Generated Audio:</h3>
          <audio controls src={audioSrc} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </CardFooter>
      )}
    </Card>
  )
}
