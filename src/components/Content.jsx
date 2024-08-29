import React from 'react'
import {decode} from 'html-entities'
import {nanoid} from 'nanoid'

export default function Content(props){

    const [allData, setAllData] = React.useState([])
    const [formData, setFormData] =  React.useState({
        1: "",
        2: "",
        3: "",
        4: "",
        5: ""

    })

    const [checkAnswers, setCheckAnswers] = React.useState(false)
    const [points, setPoints] = React.useState(0)
   
    React.useEffect(function (){
        fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=medium&type=multiple")
            .then(response => response.json())
            .then(obj => addQuestionsArray(obj.results))
    }, [])

   function addQuestionsArray(data){
        for (let i = 0; i<data.length; i++){
            const ansArray = (data[i].incorrect_answers).slice()
            const rightAns = data[i].correct_answer     
            const randomIndex = Math.floor(Math.random()*3)
            ansArray.splice(randomIndex, 0, rightAns)
            data[i] = {...data[i], questionsArr: ansArray}
        }
        
        setAllData(data)
   }

   function handleChange(event){
        const {name, value} = event.target
        setFormData(prevState => {
            return {
                ...prevState,   
                [name]: value
            }
        })
   }

   function handleSubmit(event){
        event.preventDefault()
        let pointCount = 0

        allData.forEach((item, index) => {
            const correctAnswer = item.correct_answer
            const userAnswer = formData[index + 1]
            if (userAnswer === correctAnswer) {
                pointCount++
            }
        })

        setPoints(pointCount)
        setCheckAnswers(true)

        if (pointCount > props.highScore) {
            localStorage.setItem("score", JSON.stringify(pointCount))
            props.updateBestScore(pointCount)
        }
   }

   function determineButtonStyles(correctAns, userAns, option){
        let styles= {}
        if (checkAnswers){
            if (option===correctAns && userAns===correctAns){
                styles={
                    backgroundColor: "#65cf7b",
                    color: "black"
                }
            }

            else if (option===correctAns && userAns!=correctAns){
                styles={
                    backgroundColor: "#65cf7b",
                    color: "black"
                }
            }

            else if (option != correctAns && option===userAns){
                styles={
                    backgroundColor: "#f57f7f",
                    color: "black"
                }
            }
        }

        return styles
   }

   function generateInputs(optionsArr, formName){
        const correctAns = allData[(formName-1)].correct_answer
        const userAns = formData[formName]

        const optionElements = optionsArr.map(option => {
            const setStyles = determineButtonStyles(correctAns, userAns, option)
            const formId = nanoid()
            return (
                    <div key={formId}>
                        
                        <input 
                            type="radio" 
                            value={option} 
                            name={String(formName)} 
                            id={formId}
                            checked={userAns === option} 
                            onChange={handleChange}  
                            className="radio"
                        >
                        </input>

                        <label htmlFor={formId} className="radio-btn" style={setStyles}>{decode(option)}</label>
                    </div>
            )
        
        })

        return optionElements
   }

    let name = 0    
    const formInputs = allData.map(item => {
        name++  
        return (
            <div className="question-container">
                <h1 className="question">{decode(item.question)}</h1>
                <div className="options-container">
                    {generateInputs(item.questionsArr, name)}
                </div>
            </div>
        )
    })
  
    return(
        <main className="content-main">
            <form onSubmit = {handleSubmit}>
                {formInputs}
                {checkAnswers ? 
                
                <div className="endgame-container">
                    <h1 className="point-count">You scored {points}/5 </h1>
                    <button type="button" onClick={props.toggle} className="play-again">Play Again</button> 
                </div>

                : <button className="submit-btn">Check Answers</button>}
            </form>
        </main>
    )
}