import VoiceCloner from "@/components/voice-cloner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 text-white">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight">AI Voice Cloner</h1>
        <p className="mt-2 text-lg text-slate-400">
          Enter a prompt and a YouTube link to generate audio in the cloned voice.
        </p>
      </header>
      <VoiceCloner />
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>Ensure your voice cloning API is running and accessible.</p>
      </footer>
    </div>
  )
}
