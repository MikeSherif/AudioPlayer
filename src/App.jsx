import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioPlayer from "./components/AudioPlayer.jsx";
import AudioPlayer2 from "./components/AudioPlayer2.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      {/* <AudioPlayer audioSrc="audio/1.mp3"/> */}
      <AudioPlayer2 audioSrc="audio/player2/audio.mp3"/>
    </div>
  )
}

export default App
