import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <div className="p-6 m-6 bg-yellow-200 rounded-lg text-center">
      <p className="text-red-600 text-2xl font-bold mb-4">
        Tailwind radi! 🎉
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
        Hover me!
      </button>
      <p className="mt-4 text-green-700 italic">
        Ako vidiš zelenu italik rečenicu, margin-top radi.
      </p>
    </div>
    </>
  )
}

export default App
