import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './AdminSetPeriod.css'



export default function AdminSetPeriod() {
    
    const MySwal = withReactContent(Swal)
    const [term, setTerm] = useState("")
    const [endOfChanging, setEndOfChanging] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const navigate = useNavigate()
    

    const submit = async(event) => {
        event.preventDefault()
        if(term === "" && endOfChanging === null && startDate === null && endDate === null){
            MySwal.fire({
                icon: "warning",
                title: "Please complete the form before submit"
            })
            return
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({endOfChanging: endOfChanging, startDate: startDate, endDate: endDate, term: term})
        };
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/createSchedulePeriod`, requestOptions).catch((err) => {throw err})
        let data = await response.json()
        if(response.status === 200){
            MySwal.fire({
                icon: "success",
                title: "Successfully create schedule form, back to schedule form page"
            }).then(() => {
                navigate("../ScheduleForm")
            })
        }else{
            MySwal.fire({
                icon: "warning",
                title: data.message
            })
        }
    }
    
    var subtractDays = (date, days) => {
        var input = new Date(date)
        input.setDate(input.getDate() - days)
        return input.toISOString().substring(0,10)
    }

    return (
        <div id='AdminSetPeriodBase'>
            <div id='title'>
                Craete Schedule Period Form
            </div>
            <form onSubmit={(event) => submit(event)}>
                <label>
                    Term:
                    <input type="text" value={term} name="term" onChange={(e) => {setTerm(e.target.value)}}/>
                </label>
                <label>
                    Starting Date of Schedule:
                    <input type="date" name="startDate" min={subtractDays(new Date(), -3)} onChange={(e) => {setStartDate(e.target.value);}}/>
                </label>
                <label>
                    Ending Date of Schedule:
                    <input type="date" name="endDate" min={subtractDays(startDate, -1)} onChange={(e) => {setEndDate(e.target.value)}} disabled={startDate === null? true: false}/>
                </label>
                <label>
                    Deadline of Changing Schedule:
                    <input type="date" name="endOfChanging" max={subtractDays(startDate, 3)} onChange={(e) => {setEndOfChanging(e.target.value)}} disabled={startDate === null? true: false}/>
                </label>
                {startDate === null? <div id='warning'>Please input the starting date before inputing end of date and deadline of changing</div>:<div></div>}
                <input id='submit' type="submit" value="Submit" />
            </form>
        </div>
    )
}
