import React, {useState, useEffect, useRef, useCallback} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './AdminGenerateSpecificSchedule.css'

function Card(props){


  const getDate = useCallback((timeslot) => {
    var output = Object.keys(props.info.time_slot_hash).find(key => props.info.time_slot_hash[key] === timeslot[0])
    if(!output){
      return
    }
    var year = new Date().getFullYear()
    output = output.split('-')[0]
    const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var month = ("0" + (months.indexOf(output.substring(0,3)) + 1)).slice(-2)
    return `${year}-${month}-${output.substring(3,output.length).length === 1? "0"+output.substring(3,output.length):output.substring(3,output.length)}`
  }, [props.info.time_slot_hash])

  const getTime = useCallback((timeslot) => {
    var output = Object.keys(props.info.time_slot_hash).find(key => props.info.time_slot_hash[key] === timeslot[0])
    if(!output){
      return
    }
    output = output.split("-")
    return (output[2].length === 4 ? "0" + output[2] : output[2])
  }, [props.info.time_slot_hash])

  useEffect(()=>{
    if(props.presentationTime){
      if(props.presentationTime[props.group]){
        var date = getDate(props.presentationTime[props.group].timeslot)
        var time = getTime(props.presentationTime[props.group].timeslot)
        setPresentDate(date)
        setPresentTime(time)
      }
    }
    if(props.presentationPlace){
      setPresentPlace(props.presentationPlace[props.group])
    }
  }, [props.presentationTime, props.presentationPlace, props.group, getDate, getTime]);

  const MySwal = withReactContent(Swal)
  const [presentDate, setPresentDate] = useState('')
  const [presentTime, setPresentTime] = useState('')
  const [presentPlace, setPresentPlace] = useState('')

  const adjustTime = (time) => {
    time = time.split(":")
    var hour = parseInt(time[0])
    var minute = parseInt(time[1])
    if((minute%20) >= 10){
      minute = (Math.floor(minute/20) + 1) * 20
      if(minute === 60){
        if(hour === 17){
          return `17:40`
        }else{
          return `${(hour + 1 < 10 ? `0${hour+1}`:`${hour+1}`)}:00`
        }
      }else if(minute === 0){
        return `${(hour < 10 ? `0${hour}`:`${hour}`)}:00`
      }else{
        return `${(hour < 10 ? `0${hour}`:`${hour}`)}:${minute}`
      }
    }else{
      minute = Math.floor(minute/20) * 20
      if(minute === 0){
        return `${(hour < 10 ? `0${hour}`:`${hour}`)}:00`
      }else{
        return `${(hour < 10 ? `0${hour}`:`${hour}`)}:${minute}`
      }
    }
  }

  const checkEnoughTime = (time) => {
    time = time.split(":")
    var hour = parseInt(time[0])
    var minute = parseInt(time[1])
    var total_hour = (hour-9)*60 + minute + props.groupTime[props.group][0] * 20
    if(total_hour <= 540){
      return true
    }else{
      return false
    }
  }

  const updateDate = (event) => {
    event.preventDefault()
    var date = new Date(event.target.value)
    if(date.getDay() === 6 || date.getDay() === 0){
      MySwal.fire({
        icon: "warning",
        title: "Presentation Date cannot hold in weekend"
      })
    }else if(presentTime === ''){
      // check have time clash with the supervisor examiner and the group // check have the time or not
      setPresentDate(event.target.value)
      return
    }else{
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var adjust_time
      if(presentTime === '09:20'){
        adjust_time = "9:20"
      }else if(presentTime === '09:00'){
        adjust_time = "9:00"
      }else if(presentTime === '09:40'){
        adjust_time = "9:40"
      }else{
        adjust_time = presentTime
      }
      var key = `${months[date.getMonth()]}${date.getDate()}-${days[date.getDay()]}-${adjust_time}`
      //convert the key to consective
      var count = props.info.time_slot_hash[key]
      var timeslot = []
      for(var i=0; i <props.groupTime[props.group][0]; i++){
        timeslot.push(count + i)
      }
      //check personal supervisor check group check examiner
      var supervisor_available = timeslot.every(element => {
        return props.supervisorTime[props.groupTime[props.group][2]].includes(element);
      })
      if(!supervisor_available){
        MySwal.fire({
          icon: 'warning',
          title: `Supervisor-${props.groupTime[props.group][2]} is not available in the given timeslot. Are you sure to continue?`,
          showConfirmButton: "Yes",
          showCancelButton: "No"
        }).then((result) => {
          if(!result.isConfirmed){
            return
          }
        })
      }
      var examiner_available = timeslot.every(element => {
        return props.supervisorTime[props.groupTime[props.group][3]].includes(element);
      })
      if(!examiner_available){
        MySwal.fire({
          icon: 'warning',
          title: `Examiner-${props.groupTime[props.group][3]} is not available in the given timeslot. Are you sure to continue?`,
          showConfirmButton: "Yes",
          showCancelButton: "No"
        }).then((result) => {
          if(!result.isConfirmed){
            return
          }
        })
      }
      var group_available = timeslot.every(element => {
        return props.groupTime[props.group][1].includes(element);
      })
      if(!group_available){
        MySwal.fire({
          icon: 'warning',
          title: `${props.group} is not available in the given timeslot. Are you sure to continue?`,
          showConfirmButton: "Yes",
          showCancelButton: "No"
        }).then((result) => {
          if(!result.isConfirmed){
            return
          }
        })
      }
      // check time clash
      if(!props.presentationTime){
        var presentation_group = []
      }else{
        presentation_group = Object.keys(props.presentationTime)
      }
      var group_key, group_time_slot
      var check = false
      for(var j = 0; j < presentation_group.length; j++){
        group_key = presentation_group[j]
        if(group_key === props.group){
          continue
        }else if(!props.presentationTime[group_key]){
          continue
        }else{
          group_time_slot = props.presentationTime[group_key].timeslot
          for(var k = 0; k < timeslot.length; k++){
            if(group_time_slot.includes(timeslot[k])){
              check = true
              break
            }
          }
        }
      }
      if(check){
        if(props.presentationTime[group_key].examiner===props.groupTime[props.group][3] || props.presentationTime[group_key].examiner === props.groupTime[props.group][3] || props.presentationTime[group_key].supervisor===props.groupTime[props.group][2] || props.presentationTime[group_key].supervisor===props.groupTime[props.group][2]){
          MySwal.fire({
            icon: 'warning',
            title: "Time Clash exist. Please change another time",
            showConfirmButton: true
          })
          return
        }
      }
      // update presentation time
      if(!props.presentationTime){
        var clone_presentation_time = {}
      }else{
        clone_presentation_time = JSON.parse(JSON.stringify(props.presentationTime))
      }
      clone_presentation_time[props.group] = {timeslot: timeslot, supervisor: props.groupTime[props.group][2], examiner: props.groupTime[props.group][3]}
      props.setPresentationTime(clone_presentation_time)
    }
  }

  const updateTime = (event) => {
    event.preventDefault()
    var time = event.target.value.split(":")
    if(parseInt(time[0]) >= 18 || parseInt(time[0]) < 9){
      MySwal.fire({
        icon: "warning",
        title: "Presentation Time need to start with 9:00 - 5:40"
      })
    }else if(presentDate === ''){
      // check have time clash with the supervisor examiner and the group // check have the time or not
      var adjust_time = adjustTime(event.target.value)
      var check_enough_time = checkEnoughTime(adjust_time)
      if(!check_enough_time){
        MySwal.fire({
          icon: "warning",
          title: "Not enought time for presentation"
        }).then(() => {
          return
        })
      }else{
        setPresentTime(adjust_time)
        return
      }
    }else{
      var date = new Date(presentDate)
      adjust_time = adjustTime(event.target.value)
      check_enough_time = checkEnoughTime(adjust_time)
      if(!check_enough_time){
        MySwal.fire({
          icon: "warning",
          title: "Not enought time for presentation"
        })
        return
      }
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if(adjust_time === '09:20'){
        adjust_time = "9:20"
      }else if(adjust_time === '09:00'){
        adjust_time = "9:00"
      }else if(adjust_time === '09:40'){
        adjust_time = "9:40"
      }
      var key = `${months[date.getMonth()]}${date.getDate()}-${days[date.getDay()]}-${adjust_time}`
      //convert the key to consective
      var count = props.info.time_slot_hash[key]
      var timeslot = []
      for(var i=0; i <props.groupTime[props.group][0]; i++){
        timeslot.push(count + i)
      }
      //check personal supervisor check group check examiner
      var supervisor_available = timeslot.every(element => {
        return props.supervisorTime[props.groupTime[props.group][2]].includes(element);
      })
      if(!supervisor_available){
        MySwal.fire({
          icon: 'warning',
          title: `Supervisor-${props.groupTime[props.group][2]} is not available in the given timeslot. Are you sure to continue?`,
          showConfirmButton: "Yes",
          showCancelButton: "No"
        }).then((result) => {
          if(!result.isConfirmed){
            return
          }
        })
      }
      var examiner_available = timeslot.every(element => {
        return props.supervisorTime[props.groupTime[props.group][3]].includes(element);
      })
      if(!examiner_available){
        MySwal.fire({
          icon: 'warning',
          title: `Examiner-${props.groupTime[props.group][3]} is not available in the given timeslot. Are you sure to continue?`,
          showConfirmButton: "Yes",
          showCancelButton: "No"
        }).then((result) => {
          if(!result.isConfirmed){
            return
          }
        })
      }
      var group_available = timeslot.every(element => {
        return props.groupTime[props.group][1].includes(element);
      })
      if(!group_available){
        MySwal.fire({
          icon: 'warning',
          title: 'Group is not available in the given timeslot. Are you sure to continue?',
          showConfirmButton: "Yes",
          showCancelButton: "No"
        }).then((result) => {
          if(!result.isConfirmed){
            return
          }
        })
      }
      // check time clash
      if(!props.presentationTime){
        var presentation_group = []
      }else{
        presentation_group = Object.keys(props.presentationTime)
      }
      var group_key, group_time_slot
      var check = false
      for(var j = 0; j < presentation_group.length; j++){
        group_key = presentation_group[j]
        if(group_key === props.group){
          continue
        }else if(!props.presentationTime[group_key]){
          continue
        }else{
          group_time_slot = props.presentationTime[group_key].timeslot
          for(var k = 0; k < timeslot.length; k++){
            if(group_time_slot.includes(timeslot[k])){
              check = true
              break
            }
          }
        }
      }
      if(check){
        if(props.presentationTime[group_key].examiner===props.groupTime[props.group][3] || props.presentationTime[group_key].examiner === props.groupTime[props.group][3] || props.presentationTime[group_key].supervisor===props.groupTime[props.group][2] || props.presentationTime[group_key].supervisor===props.groupTime[props.group][2]){
          MySwal.fire({
            icon: 'warning',
            title: "Time Clash exist. Please change another time",
            showConfirmButton: true
          })
          return
        }
      }
      // update presentation time
      if(!props.presentationTime){
        var clone_presentation_time = {}
      }else{
        clone_presentation_time = JSON.parse(JSON.stringify(props.presentationTime))
      }
      clone_presentation_time[props.group] = {timeslot: timeslot, supervisor: props.groupTime[props.group][2], examiner: props.groupTime[props.group][3]}
      if(adjust_time === "9:20"){
        adjust_time = "09:20"
      }else if(adjust_time === '9:00'){
        adjust_time = "09:00"
      }else if(adjust_time === '9:40'){
        adjust_time = "09:40"
      }
      setPresentTime(adjust_time)
      props.setPresentationTime(clone_presentation_time)
    }
  }

  const updatePlace = (event) => {
    event.preventDefault()
    var clone_presentation_place = {}
    if(props.presentationPlace){
      clone_presentation_place = JSON.parse(JSON.stringify(props.presentationPlace))
    }
    clone_presentation_place[props.group] = event.target.value
    console.log(clone_presentation_place)
    props.setPresentationPlace(clone_presentation_place)
  }

  const reset = () => {
    if(!props.presentationTime){
      var clone_presentation_time = {}
    }else{
      clone_presentation_time = JSON.parse(JSON.stringify(props.presentationTime))
    }
    delete clone_presentation_time[props.group]
    setPresentDate("")
    setPresentTime("")
    props.setPresentationTime(clone_presentation_time)
    console.log("check")
  }

  return(
    <div className='cardBase'>
      <p>Group Name: {props.group}</p>
      <p>Supervisor: {props.groupTime[props.group][2]}</p>
      <p>Examiner: {props.groupTime[props.group][3]}</p>
      <p>Required Presentation Time: {props.groupTime[props.group][0]*20} mins</p>
      <label>Presentation Date: </label> <input value={presentDate} onChange={(e) => {updateDate(e)}} min={props.info.start_of_date.substring(0,10)} max={props.info.end_of_date.substring(0,10)} type="date"/>
      <br/>
      <label>Presentation Time: </label> <input value={presentTime} onChange={(e) => {updateTime(e)}} min="09:00" max="18:00"step="1200" type="time"/>
      <br/>
      <label>Presentation Venue: </label> <input value={presentPlace || ''} onChange={(e) => {updatePlace(e)}} type="text"/>
      <div className="button" onClick={(e) => {reset()}}>RESET</div>
    </div>
  )
}

// onChange={(e) => {updateDate(e)}}

function AdminGenerateSpecificSchedule() {

  const hasFetchedData = useRef(false)
  const MySwal = withReactContent(Swal)
  const params = useParams()
  const navigate = useNavigate()
  const [info, setInfo] = useState(null)
  const [supervisorTime, setSupervisorTime] = useState(null)
  const [groupTime, setGroupTime] = useState(null)
  const [groupsWithoutExaminer, setGroupsWithoutExaminer] = useState(null)
  const [presentationTime, setPresentationTime] = useState({})
  const [presentationPlace, setPresentationPlace] = useState({})
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchData = async() => {
      const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      };
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewSpecificSchedule/${params.id}`, requestOptions)
      let data = await response.json()
      if(response.status === 200){
        setInfo({start_of_date: data.start_of_date, end_of_date: data.end_of_date, term: data.term, time_slot_hash: data.time_slot_hash})
        setSupervisorTime(data.supervisor_time)
        setGroupTime(data.group_time)
        setPresentationPlace(data.data.presentation_place)
        setGroupsWithoutExaminer(data.groups_without_examiner)
        setPresentationTime(data.data.presentation_time)
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
  }, [MySwal, navigate, params.id])


  const submit = async(event)=>{
    event.preventDefault()
    console.log(presentationTime)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({id: params.id, presentationTime: presentationTime, presentationPlace: presentationPlace})
    };
    // let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/generateSpecificSchedule/${params.id}`, requestOptions)
    const {value: response} = await MySwal.fire({
      title: "Are you sure to Update Presentation Schedule?",
      confirmButtonText: 'Update',
      showCancelButton: true,
      preConfirm: async() => {
        Swal.showLoading()
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/updateSpecificSchedule`, requestOptions)
        return response
      }
    })
    let data = await response.json()
    if(response.status === 200){
      MySwal.fire({
        icon: "success",
        title: "Successfully update!"
      })
      return
    }else{
      MySwal.fire({
        icon: "warning",
        title: data.message,
        text: data.error
      })
      return
    }
  }

  const genearte = async(event) => {
    event.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({id: params.id, presentationTime: presentationTime})
    };
    // let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/generateSpecificSchedule/${params.id}`, requestOptions)
    const {value: response} = await MySwal.fire({
      title: "Are you sure to Generate Presentation Schedule?",
      confirmButtonText: 'Generate',
      showCancelButton: true,
      preConfirm: async() => {
        Swal.showLoading()
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/generateSpecificSchedule`, requestOptions)
        return response
      }
    })
    if(!response){
      return
    }
    let data = await response.json()
    if(response.status === 200){
      //update Presenation Time
      if(!presentationTime){
        var obj = {}
        for(var i = 0; i < data.schedule.length; i++){
          var group = data.schedule[i][0]
          var group_presentation_time = data.schedule[i][1]
          var group_supervisor = groupTime[group][2]
          var group_examiner = groupTime[group][3]
          obj[group] = {timeslot: group_presentation_time, supervisor: group_supervisor, examiner: group_examiner}
        }
        setPresentationTime(obj)
        return
      }else{
        var clone_presentation_time = JSON.parse(JSON.stringify(presentationTime))
        var presentation_group = Object.keys(presentationTime)
        var check
        for(i = 0; i < data.schedule.length; i++){
          group = data.schedule[i][0]
          group_presentation_time = data.schedule[i][1]
          group_supervisor = groupTime[group][2]
          group_examiner = groupTime[group][3]
          check = false
          for(var j = 0; j < presentation_group.length; j++){
            if(group === presentation_group[j]){
              continue
            }else{
              var group_time_slot = presentationTime[presentation_group[j]].timeslot
              for(var k = 0; k < group_presentation_time.length; k++){
                if(group_time_slot.includes(group_presentation_time[k])){
                  check = true
                  break
                }
              }
              if(check){
                break
              }
            }
          }
          if(!check){
            clone_presentation_time[group] = {timeslot: group_presentation_time, supervisor: group_supervisor, examiner: group_examiner}
          }
        }
        setPresentationTime(clone_presentation_time)
        return
      }
    }else{
      MySwal.fire({
        icon: "warning",
        title: data.message,
        text: data.error
      })
      return
    }
  }


  
  return (
    <div id='AdminGenerateSpecificScheduleBase'>
            {loading?
                <>fetching data</>
            :
            <>
              <div id='title'>
                {info.term} Presentation Schedules
              </div>
              <div id='info'>
                {
                  Object.keys(groupTime).map((group) => {
                    return <Card key={group} presentationPlace={presentationPlace} setPresentationPlace={setPresentationPlace} group={group} info={info} supervisorTime={supervisorTime} setSupervisorTime={setSupervisorTime} groupTime={groupTime} setGroupTime={setGroupTime} presentationTime={presentationTime} setPresentationTime={setPresentationTime}/>
                  })
                }
              </div>
              <div id='controller'>
                <div className="button" onClick={(e) => {submit(e)}}>
                  Submit
                </div>
                <div className="button" onClick={(e) => {genearte(e)}}>
                  Genearte
                </div>
              </div>
              <div id='GroupWithoutExaminerBase'>
                {(groupsWithoutExaminer === null || groupsWithoutExaminer === [])?
                  <></>
                  :
                  <>
                  <div>Group(s) Without Examiner</div>
                  {
                    groupsWithoutExaminer.map((group) => {
                      return(
                        <div key={group._id} className='GroupWithoutExaminer'>
                          <div>Group Name: {group.group_name}</div>
                          <div>Supervisor: {group.supervisor}</div>
                        </div>
                      )
                    })
                  }
                  </>
                }
              </div>
            </>
            }
      </div>
  )
}

export default AdminGenerateSpecificSchedule