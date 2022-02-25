import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import "./StudentEditPeerReview.css"

function Question(props){
  
  const updateResponse = (e) => {
    var obj = {...props.response}
    obj[props.question._id] = e.target.value
    props.setResponse(obj)
  }

  return(
    <div className="questionBase">
      <label>{props.question.question}{" "}{props.question.question_to === "Self"? "":`To: ${props.question.question_to}`}{" "}{props.question.question_required? "(Required)": ""}</label>
      {props.question.question_type === "Text"?
      <>
        <br/>
        <input type="text" value={props.response[props.question._id]} className='inputText' required={true} placeholder="Input Your Answer Here" onChange={(e) => updateResponse(e)}/>
      </>
      :
        <input type="number" value={props.response[props.question._id]} className='inputNumber' min="0" max="5" required={true} onChange={(e) => updateResponse(e)}/>
      }
    </div>
  )
}

function StudentEditPeerReview() {

  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState({})

  useEffect(() => {
    const fetchData = async() => {
      const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      };
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/viewSpecificPeerReviewForm/${params.id}`, requestOptions)
      let data = await response.json()
      console.log(data)
      var obj = {}
      data.questions.forEach((question) => {
        if(data.student_response[question._id] === undefined){
          obj[question._id] = null
        }else{
          obj[question._id] = data.student_response[question._id]
        }
      })
      console.log(obj)
      setResponse(obj)
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])
  
  const submit = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({response: response, id: params.id})
    };
    let result = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/editSpecificPeerReviewForm`, requestOptions)
    let data = await result.json()
    console.log(data)
  }

  return (
    <div id='StudentEditPeerReviewBase'>
      {loading? 
        <>fetching Data</>
      : 
        <>
        {(data === null)?
          <>No Data can be found. Please load the page again</>
          :
          <>
            <div id='title'>
              {data.term}
            </div>
            <div id='peerReviewInfo'>
              <p>Start of Date: {data.start_of_date.slice(0,10)}</p><br/>
              <p>End of Date: {data.end_of_date.slice(0,10)}</p>
            </div>
            <div id='questions'>
              {
                data.questions.map((question) => {
                  return <Question key={question._id} question={question} response={response} setResponse={setResponse}/>
                })
              }
            </div>
            <div id='submit' onClick={(e) => {submit(e)}}>
              submit
            </div>
          </>
        }
        </>
      }
    </div>
  )
}

export default StudentEditPeerReview