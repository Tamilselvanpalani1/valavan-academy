import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-5xl font-bold text-purple-600">
        Tailwind + Vite Plugin Working ✅
      </h1>

      <button className="btn btn-primary mt-4">
        daisyUI Button 🌼
      </button>

    </>
  )
}

export default App
