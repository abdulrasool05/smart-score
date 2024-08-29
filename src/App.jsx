import React from "react"
import Landing from './components/Landing.jsx'
import Content from './components/Content.jsx'

export default function App(){

  const [landing, setLanding] = React.useState(true)
  const [bestScore, setBestScore] = React.useState(
    JSON.parse(localStorage.getItem("score")) || 0
  )
  
  function toggleScreen(){
    setLanding(prevState => !prevState)
  }

  return (
    <div>
      { landing ? <Landing toggle={toggleScreen} highScore={bestScore}/> : <Content toggle={toggleScreen} highScore={bestScore}/> }
    </div>

  )



}
