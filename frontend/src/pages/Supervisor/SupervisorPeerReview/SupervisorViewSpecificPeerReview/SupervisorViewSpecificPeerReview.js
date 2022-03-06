import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './SupervisorViewSpecificPeerReview.css'

function Card(props){
  
  const [show, setShow] = useState("none")

  return(
    <div className='form' onClick={(e) => {(show === "none")? setShow("flex") : setShow("none")}}>
      <div className='top'>
        <div className='info'>
          <div>Term: {props.data.term}</div>
          <div>Start of Date: {props.data.start_of_date.substring(0,10)}</div>
          <div>End of Date: {props.data.end_of_date.substring(0,10)}</div>
        </div>
        {show === "none"?
          <div>
              ▶
          </div>
          :
          <div>
              ▼
          </div>
        }
      </div>
      <div className='bottom' style={{display: show}}>
        {
          props.data.response.map((text) => {
            var input = text.split(':')
            return (
              <div className='question' key={input[0]}>
                <div>{input[0]}:</div>
                <div>{input[1]}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}


function SupervisorViewSpecificPeerReview() {
    
    const [data, setData] = useState(null)
    const [student, setStudent] = useState("")
    const [loading, setLoading] = useState(true)
    const parmas = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/viewSpecificPeerReviewForm/${parmas.id}`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            setStudent(data.student)
            setData(data.output)
          }else{
            navigate("../")
          }
          setLoading(false)
        }
        fetchData()
      }, [])

    return (
        <div id='SupervisorViewSpecificPeerReviewBase'>
          {loading? 
            <>fetching Data</>
          : 
            <>
              {(data === null || data.length === 0)?
                <>No Data can be found. Please re-load the page</>
                :
                <>
                    <div id='title'>
                        {student}'s Peer Review Form
                    </div>
                    <div id='PeerReviewFormList'>
                      {
                        data.map((form) => {
                          return <Card key={form.id} data={form} />
                        })
                      }
                    </div>
                </>
              }
            </>
          }
        </div>
    )
}

export default SupervisorViewSpecificPeerReview; 