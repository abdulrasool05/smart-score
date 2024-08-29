import React from "react"

export default function Landing(props){

    return (
        <main className="landing-main">
            <div className="landing-container">
                <h1 className="landing-title">Smart Score</h1>
                <p className="landing-description">Test your knowledge of sports!</p>
                <button className="start-btn" onClick={props.toggle} >Start Quiz</button>
                <h1 className="landing-score">Best Score: {props.highScore}/5 </h1>
            </div>
        </main>
    )
}