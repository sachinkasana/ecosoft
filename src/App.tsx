import { EcosafeLogo } from './screens/EcosafeLogo'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="scale-125">
          <EcosafeLogo />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to EcoSafe</h1>
        <p className="text-gray-600">
          You’re successfully logged in.
        </p>

        <button
          className="mt-4 px-6 py-3 rounded-2xl bg-brand/90 text-white font-medium hover:bg-brand/100 active:scale-[0.98] transition"
          onClick={() => alert('Start using the app!')}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
