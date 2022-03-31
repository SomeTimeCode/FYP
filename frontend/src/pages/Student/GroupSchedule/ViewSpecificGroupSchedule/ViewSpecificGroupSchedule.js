import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './ViewSpecificGroupSchedule.css'

function Row(props){

  const MySwal = withReactContent(Swal)
  
  const changeTime = (date, time) =>{
    console.log(date, time)
    console.log(props.data[date][time]["commit"])
    MySwal.fire({
      title: `${props.data[date][time]["commit"] === ''? "No commit in this timeslot" : props.data[date][time]["commit"]}`,
      text: `Are you sure to change to ${props.data[date][time]["available"]? "unavailable" : "available"}?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Change",
      cancelButtonText: "Return"
    }).then((result) => {
      if(result.isConfirmed){
        MySwal.fire({
          title: "Input commit Reason",
          input: "text"
        }).then((result) => {
          var temp = JSON.parse(JSON.stringify(props.data))
          temp[date][time]["available"] = !(props.data[date][time]["available"])
          temp[date][time]['commit'] = (result.value === ''? `${props.student} ${props.data[date][time]["available"]? "is unavailable" : "removes unavailable"}`:result.value)
          props.setData(temp)
        }).then(() => {
          MySwal.fire({
            title: "Updated"
          })
        })
      }
    })
  }


  return (
    <tr>
      <td className="timeslot">{props.time}</td>
      {
        Object.keys(props.data).map((date) => {
          if(props.data[date][props.time].available){
            return <td className="timeslot greenBase" key={`${date}-${props.time}`} onClick={(e) => changeTime(date, props.time)}></td>
          }else{
            return <td className="timeslot redBase" key={`${date}-${props.time}`} onClick={(e) => changeTime(date, props.time)}></td>
          }
        })
      }
    </tr>
  )
}

function Table(props){

  const timeslot = [
                    "9:00", "9:20", "9:40", "10:00", "10:20", "10:40", 
                    "11:00", "11:20", "11:40", "12:00", "12:20", "12:40", 
                    "13:00", "13:20", "13:40", "14:00", "14:20", "14:40",
                    "15:00", "15:20", "15:40", "16:00", "16:20", "16:40",
                    "17:00", "17:20", "17:40",
                   ] 

  return (
    <table>
      <thead>
        <tr>
          <td className="date">Session/Day</td>
          {
            Object.keys(props.data).map((key)=>{
              key = key.split('-')
              return <td className="date" key={key}>{key[0]}<br/>{key[1]}</td>
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          timeslot.map((time)=>{
            return (
              <Row key={time} time={time} data={props.data} setData={props.setData} student={props.student}/>
            )
          })
        }
      </tbody>
    </table>
  )
}

function ViewSpecificGroupSchedule() {

  const hasFetchedData = useRef(false)
  const MySwal = withReactContent(Swal)
  const params = useParams()
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState(null)
  const [data, setData] = useState("")
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState("")

  useEffect(() => {
      const fetchData = async () => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/viewSpecificSchedule/${params.id}`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            if(data.data === ''){
              // initalize the data
              const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
              const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              var obj = {}
              var startDate = new Date(data.startDate)
              var endDate = new Date(data.endDate)
              endDate.setDate(endDate.getDate() + 1)
              var countDate = startDate
              while(countDate < endDate){
                if(countDate.getDay() !== 0 && countDate.getDay() !== 6){
                  var key = `${months[countDate.getMonth()]}${countDate.getDate()}-${days[countDate.getDay()]}`
                  obj[key] = {
                              "9:00": {available: true, commit: ""}, "9:20": {available: true, commit: ""}, "9:40": {available: true, commit: ""}, 
                              "10:00": {available: true, commit: ""}, "10:20": {available: true, commit: ""}, "10:40": {available: true, commit: ""},
                              "11:00": {available: true, commit: ""}, "11:20": {available: true, commit: ""}, "11:40": {available: true, commit: ""},
                              "12:00": {available: true, commit: ""}, "12:20": {available: true, commit: ""}, "12:40": {available: true, commit: ""},
                              "13:00": {available: true, commit: ""}, "13:20": {available: true, commit: ""}, "13:40": {available: true, commit: ""},
                              "14:00": {available: true, commit: ""}, "14:20": {available: true, commit: ""}, "14:40": {available: true, commit: ""},
                              "15:00": {available: true, commit: ""}, "15:20": {available: true, commit: ""}, "15:40": {available: true, commit: ""},
                              "16:00": {available: true, commit: ""}, "16:20": {available: true, commit: ""}, "16:40": {available: true, commit: ""},
                              "17:00": {available: true, commit: ""}, "17:20": {available: true, commit: ""}, "17:40": {available: true, commit: ""},
                            }
                }
                countDate.setDate(countDate.getDate() + 1)
              }
              setData(obj)
            }else{
              setData(JSON.parse(data.data))
            }
            setStudent(data.student)
            setSchedule({endOfChanging: data.endOfChanging, startDate: data.startDate, endDate: data.endDate, term: data.term})
            setLoading(false)
          }else{
            MySwal.fire({
              title: data.message,
              text: data.error,
              confirmButtonText: "Back to Home Page"
            }).then((result) => {
                if(result.isConfirmed){
                    navigate("../")
                }
            })
          }
      }
      if (!hasFetchedData.current) {
        fetchData()
        hasFetchedData.current = true;
      }
      console.log('effect')
  }, [MySwal, navigate, params.id])

  const sumbit = (event) => {
    event.preventDefault()
    var endOfChanging = new Date(schedule.endOfChanging)
    endOfChanging.setDate(endOfChanging.getDate() + 1)
    var tdy = new Date()
    console.log(endOfChanging)
    if(tdy > endOfChanging){
      MySwal.fire({
        title: "No longer allow changing the schedule availability"
      })
      return
    }
    MySwal.fire({
      title: "Are you sure to upload the schedule?",
      showConfirmButton: true,
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then(async (result) => {
      if(result.isConfirmed){
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          body: JSON.stringify({data: data, id: params.id})
        };
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/updateSpecificSchedule`, requestOptions)
        let response_data = await response.json()
        if(response.status === 200){
          MySwal.fire({
            title: "Successfully update schedule",
            showCloseButton: true
          })
        }else{
          MySwal.fire({
            title: response_data.message + ' Please try again',
            text: response_data.error
          })
        }
      }
    })
  }


  return (
    <div id='ViewSpecificGroupScheduleBase'>
            {loading?
                <>fetching data</>
            :
            <>
              <div id='title'>
                Group's {schedule.term} Presentation Schedules
              </div>
              <div id='info'>
                <div id='Schedules'>
                  <Table data={data} setData={setData} student={student}/>
                </div>
                <div id='submit' onClick={(e) => {sumbit(e)}}>
                  Submit
                </div>
              </div>
            </>
            }
      </div>
  )
}

export default ViewSpecificGroupSchedule