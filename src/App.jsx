import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioPlayer from "./components/AudioPlayer.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <AudioPlayer audioSrc="audio/1.mp3"/>
    </div>
  )
}

export default App
