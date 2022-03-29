import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import './AdminCreatePeerReview.css'
import { useNavigate } from 'react-router-dom'

function Question(props){

  const [collect, drag] = useDrag(() => ({
      item: props.question,
      type: 'question'
  }), [])

  return(
    <div className='question' ref={drag}>
      <p>Question: {props.question.question}</p>
      <p>Question Type:{props.question.question_type}</p>
      <p>Required: {props.question.question_required.toString()} {' '} To: {props.question.question_to}</p>
    </div>
  )
}


function QuestionBank(props){

  const [questionsList, setQuestionsList] = useState([])

  useEffect(()=>{
    setQuestionsList([...props.questionBank])
  }, [props.questionBank])

  const [{canDrop}, drop] = useDrop(() => ({
    accept: "question",
    canDrop: (item,monitor) => {
      if(props.questionBank.some((question) => question._id === item._id)){
        return false
      }
      return true
    },
    drop: (item, monitor) => {
      var temp_questionBank = [...props.questionBank]
      temp_questionBank.push(item)
      var temp_questionSubmit = props.questionSubmit.filter(question => {
        if(question._id !== item._id){
          return true
        }else{
          return false
        }
      })
      props.setQuestionSubmit(temp_questionSubmit)
      props.setQuestionBank(temp_questionBank)
    }
  }), [props.questionBank, props.questionSubmit])

  return(
    <div className='questionBox'>
      <div className='title'>
        Questions Bank
      </div>
      <input type="text" placeholder='Search question here' onChange={(e) => {
        var temp_quesitonsList = props.questionBank.filter(question => question.question.includes(e.target.value))
        setQuestionsList(temp_quesitonsList)
      }}/>
      <div className='questionList' ref={drop}>
        {props.loading ?
          <>Loading questions</>
          :
          <>
            {questionsList.length < 1?
              <>
                <p>Do not have any question in the question bank currently. Please current new question.</p>
              </>
              :
              <>
                {questionsList.map((question) => {
                  return <Question key={question._id} question={question}/>
                })
                }
              </>
            }
          </>
        }
      </div>
    </div>
  )
}

function AddQuestion(props){
  const [{canDrop}, drop] = useDrop(() => ({
    accept: "question",
    canDrop: (item,monitor) => {
      if(props.questionSubmit.some((question) => question._id === item._id)){
        return false
      }
      return true
    },
    drop: (item, monitor) => {
      var temp_questionSubmit = [...props.questionSubmit]
      temp_questionSubmit.push(item)
      var temp_questionBank = props.questionBank.filter(question => question._id !== item._id)
      props.setQuestionSubmit(temp_questionSubmit)
      props.setQuestionBank(temp_questionBank)
    }
  }), [props.questionBank, props.questionSubmit])

  return(
    <div className='questionBox'>
      <div className='title'>
        Peer Review Questions
      </div>
      <div className='questionList' ref={drop}>
        {props.questionSubmit.length < 1?
          <>
            <p>Please Add Question to the Peer Review Form</p>
          </>
          :
          <>
            {props.questionSubmit.map((question) => {
              return <Question key={question._id} question={question}/>
            })
            }
          </>
        }
      </div>
    </div>
  )
}


function AdminCreatePeerReview() {

  const MySwal = withReactContent(Swal)
  const current = new Date()
  const naviage = useNavigate()
  const date = current.toISOString().substring(0,10)
  const [startDate, setStartDate] = useState(date)
  const [endDate, setEndDate] = useState(date)
  const [term, setTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [questionSubmit, setQuestionSubmit] = useState([])
  const [questionBank, setQuestionBank] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      };
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewPeerReviewQuestion`, requestOptions)
      let data = await response.json()
      if(response.status !== 200){
        MySwal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: data.message
        })
      }else{
        setQuestionBank(data)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const createQuestion = async() =>{
    var question, question_type, question_required, question_to
    question = await MySwal.fire({
      title: 'Input Question',
      input: 'text',
      inputLabel: 'Question',
      inputPlaceholder: 'Input your question',
      confirmButtonText: 'NEXT',
      showCloseButton: true,
      inputValidator: (question) => {
        if(!question){
          return 'You need to input your question'
        }
      }
    })
    if(question.isConfirmed){
      question_type = await MySwal.fire({
        title: 'Select Question type',
        input: 'radio',
        inputOptions: {
          "Rating":"Rating",
          "Text":"Text"
        },
        showCloseButton: true,
        confirmButtonText: 'NEXT',
        inputValidator: (question_type) => {
          if(!question_type){
            return "You need to select question's type"
          }
        }
      })
    }else{
      question = null
      return 
    }
    if(question_type.isConfirmed){
      question_required = await MySwal.fire({
        title: 'Question required restriction',
        input: 'radio',
        inputOptions: {
          "True": "Required",
          "False":"Not Required"
        },
        showCloseButton: true,
        confirmButtonText: 'Submit',
        inputValidator: (question_required) => {
          if(!question_required){
            return "You need to select question's restriction"
          }
        }
      })
    }else{
      question_type = null
      return
    }
    if(question_required.isConfirmed){
      question_to = await MySwal.fire({
        title: 'Question required restriction',
        input: 'radio',
        inputOptions: {
          "Self": "Self",
          "Others":"Others"
        },
        showCloseButton: true,
        confirmButtonText: 'Submit',
        inputValidator: (question_to) => {
          if(!question_to){
            return "You need to select question's restriction"
          }
        }
      })
    }else{
      question_type = null
      return
    }
    if(question_to.isConfirmed){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({question: question.value, question_required: question_required.value, question_type: question_type.value, question_to: question_to.value})
      };
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/createPeerReviewQuestion`, requestOptions).catch((err) => {throw err})
      var data = await response.json()
      if(response.status === 200){
        let temp_quesiton = [...questionSubmit]
        temp_quesiton.push(data)
        setQuestionSubmit(temp_quesiton)
        MySwal.fire({
          title: 'Success',
          icon: 'success'
        })
      }else{
        MySwal.fire({
          title: "Failuer in creating question",
          text: data.message,
          icon: 'error'
        })
      }
    }else{
      question_required = null
      return
    }
  }

  const submit = async() => {
    // check inupt once
    if(questionSubmit.length === 0 && term === ''){
      MySwal.fire({
        title: "Insufficent Information.",
        text: "Please complete the Peer Review Form",
        icon: "warning"
      })
      return
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({startDate: startDate, endDate: endDate, term: term, questionSubmit: questionSubmit})
    };
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/createPeerReview`, requestOptions)
    let data = await response.json()
    if(response.status !== 200){
      MySwal.fire({
        icon: "warning",
        title: "Unexpected Error",
        text: data.message
      })
      return
    }else{
      MySwal.fire({
        icon: "success",
        title: "Peer Review Form successfully created"
      }).then(() => {
        naviage(`../EditPeerReview/${data._id}`)
      })
    }
  }

  return (
    <div id='AdminCreatePeerReviewBase'>
      <div id='title'>
        Create Peer Review Form
      </div>
      <div id='createQuestion' onClick={() => createQuestion()}>
        Add Question
      </div>
      <div id='form'>
        <label>Start Date:</label>
        <input type="date" id="start" value={startDate} min={date} onChange={(e) => setStartDate(e.target.value)} required/>
        <br/>
        <label>Close Date:</label>
        <input type="date" id="start" value={endDate} min={date} onChange={(e) => {setEndDate(e.target.value)}} required/>
        <br />
        <label>Peer Review Term</label>
        <input type="text" id='term' value={term} onChange={(e) => setTerm(e.target.value)} required/>
        <div id='questionBoxes'>
          <DndProvider backend={ (window.innerWidth > 800 ? HTML5Backend : TouchBackend)}>
            <AddQuestion questionBank={questionBank} questionSubmit={questionSubmit} setQuestionBank={setQuestionBank} setQuestionSubmit={setQuestionSubmit}/>
            <QuestionBank loading={loading} questionBank={questionBank} questionSubmit={questionSubmit} setQuestionBank={setQuestionBank} setQuestionSubmit={setQuestionSubmit}/>
          </DndProvider>
        </div>
        <div id='submit' onClick={(e) => {submit()}}>
          submit
        </div>
      </div>
    </div>
  )
}

export default AdminCreatePeerReview
