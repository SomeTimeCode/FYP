import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "./StudentEditPeerReview.css"

function Question(props){
  
  const updateResponse = (e) => {
    var obj = {...props.response}
    obj[props.question._id] = e.target.value
    props.setResponse(obj)
  }

  const updateResponseNumber = (e) => {
    var obj = {...props.response}
    if(e.target.value > 5){
      obj[props.question._id] = 5
    }else if(e.target.value < 0){
      obj[props.question._id] = 0
    }else if(e.target.value === ''){
      obj[props.question._id] = 0
    }else if (e.target.value.length > 1){
      obj[props.question._id] = e.target.value.slice(-1)
    }else{
      obj[props.question._id] = e.target.value
    }
    props.setResponse(obj)
  }


  return(
    <div className="questionBase">
      <label>{props.question.question}{" "}{props.question.question_to === "Self"? "":`To: ${props.question.question_to}`}{" "}{props.question.question_required? "(Required)": ""}</label>
      {props.question.question_type === "Text"?
      <>
        <br/>
        <input type="text" value={props.response[props.question._id] === null? "" : props.response[props.question._id]} className='inputText' required={true} placeholder="Input Your Answer Here" disabled={props.disabled} onChange={(e) => updateResponse(e)}/>
      </>
      :
        <input type="number" value={props.response[props.question._id] === null? 0 : props.response[props.question._id]} className='inputNumber' min="0" max="5" required={true} disabled={props.disabled} onChange={(e) => updateResponseNumber(e)}/>
      }
    </div>
  )
}

function StudentEditPeerReview() {

  const MySwal = withReactContent(Swal)
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState({})
  const [noGroup, setNoGroup] = useState(false)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const fetchData = async() => {
      const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      };
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/viewSpecificPeerReviewForm/${params.id}`, requestOptions)
      let data = await response.json()
      var obj = {}
      if(response.status === 200){
        data.questions.forEach((question) => {
          if(data.student_response[question._id] === undefined){
            obj[question._id] = null
          }else{
            obj[question._id] = data.student_response[question._id]
          }
        })
        var tdy = new Date()
        var end = new Date(data.end_of_date)
        setDisabled(tdy > end)
        setResponse(obj)
        setData(data)
      }else if(data.message === "You don't have a approved group yet"){
        setNoGroup(true)
      }
      setLoading(false)
    }
    fetchData()
  }, [])
  
  const submit = async () => {
    if(disabled){
      MySwal.fire({
        icon: "warning",
        title: "The peer review form is already over the submission period",
        showCloseButton: true
      })
    }else{
      MySwal.fire({
        icon: "warning",
        title: "Are you sure to submit?",
        showCloseButton: true
      }).then(async (result) => {
        if(result.isConfirmed){
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({response: response, id: params.id})
          };
          let result = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/editSpecificPeerReviewForm`, requestOptions)
          let data = await result.json()
        }
      })
    }
  }

  return (
    <div id='StudentEditPeerReviewBase'>
      {loading? 
        <>fetching Data</>
      : 
        <>
        {noGroup === true?
        <>
          You don't have an approved group yet
        </>
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
                  return <Question key={question._id} question={question} disabled={disabled} response={response} setResponse={setResponse}/>
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
        </>
      }
    </div>
  )
}

export default StudentEditPeerReview