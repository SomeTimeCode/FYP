import React, {useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import "./StudentViewPeerReview.css"

function Card(props){

  const navigate = useNavigate()

  return (
    <div className='form' key={props.form._id} onClick={(e) => {navigate(`../EditPeerReview/${props.form._id}`)}}>
      <div className='info'>
        <p>Term: {props.form.term}</p>
        <p>Start of Date: {props.form.start_of_date.slice(0,10)}</p>
        <p>End of Date: {props.form.end_of_date.slice(0,10)}</p>
      </div>
      <div className="warning" style={{display: `${props.form.complete? "none" : "flex"}`}}>
      </div>
    </div>
  )
}


function StudentViewPeerReview() {
  
  const [peerReviews, setPeerReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        };
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/viewPeerReviewForm `, requestOptions)
        let data = await response.json()
        console.log(data)
        setPeerReviews(data)
        setLoading(false)
    }
    fetchData()
  }, [])
  

  return (
    <div id='StudentViewPeerReviewBase'>
        <div id='title'>
            Peer Review Forms
        </div>
        <div id='peerReviewForms'>
          {loading?
            <>fetching data</>
          :
            <>
            {peerReviews.length === 0 ?
              <>
                No Peer Review Form yet
              </>
            :
              <>
              {peerReviews.map((form) => {
                return <Card form={form}/>
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

export default StudentViewPeerReview