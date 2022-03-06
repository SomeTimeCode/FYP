import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './SupervisorViewPeerReview.css'

function Card(props){
    
    const navigate = useNavigate()
    const [show, setShow] = useState("none")

    return(
        <div className='Group' onClick={(e) => {(show === "none"? setShow("flex") : setShow("none"))}}>
            <div className='GroupName'>
                <div>{props.group}</div>
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
            <div style={{display: show}} className='memberList'>
                {   
                    Object.keys(props.members).map((member) => {
                        return (
                            <>
                            <div className="member" key={member} onClick={(e) => {navigate(`./${member}`)}}>
                                {props.members[member]}
                            </div>
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}



function SupervisorViewPeerReview() {

    const [data, setData] = useState(null)
    const [noGroup, setNoGroup] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async() => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/viewPeerReviewForm`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            setData(data)
          }else if(data.message === "You don't have any approved group"){
            setNoGroup(true)
          }
          setLoading(false)
        }
        fetchData()
      }, [])
      
    
      return (
        <div id='SupervisorViewPeerReviewBase'>
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
                    Peer Review Form
                </div>
                <div id='GroupList'>
                    {
                        Object.keys(data).map((group) => {
                            return <Card key={group} members={data[group]} group={group}/>
                        })
                    }
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

export default SupervisorViewPeerReview; 