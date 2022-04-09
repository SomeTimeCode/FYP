import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './AdminGenerateSchedule.css'

function Card(props){
    
    const navigate = useNavigate()

    return (
        <div className='schedule' onClick={(e) => {navigate(`${props.schedule._id}`)}} >
          <div className='info'>
            <p>Term: {props.schedule.term}</p>
            <p>Start of Date: {props.schedule.startDate.slice(0,10)}</p>
            <p>End of Date: {props.schedule.endDate.slice(0,10)}</p>
            <p>Deadline Of Changing Schedule: {props.schedule.endOfChanging.slice(0,10)}</p>
          </div>
        </div>
    )
}



function AdminGenerateSchedule() {

    const hasFetchedData = useRef(false)
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async() => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewSchedule`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            setSchedules(data)
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
        if(!hasFetchedData.current){
            fetchData()
            hasFetchedData.current = true;
        }
    }, [MySwal, navigate])


    return (
        <div id='AdminGenerateScheduleBase'>
            <div id='title'>
              Presentation Schedules
            </div>
            <div id='Schedules'>
            {loading?
                <>fetching data</>
            :
                <>
                {schedules.length === 0 ?
                    <>
                        No Schedule Form Yet
                    </>
                :
                    <>
                        {schedules.map((schedule) => {
                            return <Card key={schedule._id} schedule={schedule}/>
                        })}
                    </>
                }
                </>
            }
            </div>
        </div>
    )
}

export default AdminGenerateSchedule