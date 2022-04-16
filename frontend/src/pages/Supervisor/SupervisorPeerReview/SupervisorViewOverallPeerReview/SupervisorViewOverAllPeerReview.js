import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './SupervisorViewOverAllPeerReview.css'

function Card(props){
  


  return(
    <div className='form'>
      <div className='top'>
        <div className='info'>
          <div>Term: {props.data.term}</div>
          <div>Start of Date: {props.data.start_of_date.substring(0,10)}</div>
          <div>End of Date: {props.data.end_of_date.substring(0,10)}</div>
          {props.data.performance === 'No response has collected' ? 
            <div>
              No response has collected
            </div>
            :
            <>
            <div>
              Performance: {Object.keys(props.data.performance).map((student) => {return `${student}: ${props.data.performance[student].toFixed(4)} ${" "}`})}
            </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}


function SupervisorViewOverAllPeerReview() {
    
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState(null)
    const [group, setGroup] = useState("")
    const [loading, setLoading] = useState(true)
    const parmas = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/viewOverallPeerReviewForm/${parmas.id}`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            setData(data.output)
            setGroup(data.group_name)
          }else{
            MySwal.fire({
                title: "Unexpected Error in getting to this page",
                text: data.message,
                confirmButtonText: "Back to Home Page"
            }).then((result) => {
                if(result.isConfirmed){
                    navigate("../")
                }
            })
          }
          setLoading(false)
        }
        fetchData()
      }, [])

    return (
        <div id='SupervisorViewOverAllPeerReviewBase'>
          {loading? 
            <>fetching Data</>
          : 
            <>
              {(data === null || data.length === 0)?
                <div style={{marginTop: "3vh"}}>Cannot find {group}'s Peer Review Response</div>
                :
                <>
                    <div id='title'>
                        {group}'s Peer Review Form
                    </div>
                    <div id='PeerReviewFormList'>
                      {
                        data.map((form) => {
                          return <Card key={form.term} data={form} />
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

export default SupervisorViewOverAllPeerReview; 