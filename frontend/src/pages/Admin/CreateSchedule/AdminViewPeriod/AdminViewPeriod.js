import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsFillTrashFill } from "react-icons/bs";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './AdminViewPeriod.css'


function Card(props){

    const MySwal = withReactContent(Swal)

    const remove = async(e) => {
        MySwal.fire({
            icon: 'warning',
            title: `Are you sure to delete ${props.data.term}?`,
            showConfirmButton: true,
            confirmButtonText: "YES",
            showCancelButton: true,
            cancelButtonText: "NO"
        }).then(async(result) => {
            if(result.isConfirmed){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({_id: props.data._id})
                };
                let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/deleteSchedulePeriod`, requestOptions).catch((err) => {throw err})
                let data = await response.json()
                if(response.status === 200){
                    MySwal.fire({
                        icon: "success",
                        title: "Successfully Removed"
                    })
                    props.setSchedulePeriodList(data)
                }else{
                    MySwal.fire({
                        icon: 'warning',
                        title: data.error
                    })
                }
            }
        })
    }

    return(
        <div className='cardBase'>
            <div>
                <div>Term: {props.data.term}</div>
                <div>Starting Date of Schedule: {props.data.startDate.substring(0,10)}</div>
                <div>Ending Date of Schedule:{props.data.endDate.substring(0,10)}</div>
                <div>Deadline of Changing Schedule:{props.data.endOfChanging.substring(0,10)}</div>
            </div>
            <div className='Remove' onClick={(e) => {remove(e)}}>
                <BsFillTrashFill/>
            </div>
        </div>
    )

}

export default function AdminViewPeriod() {

    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()
    const [schedulePeriodList, setSchedulePeriodList] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewSchedulePeriod`, requestOptions).catch((err) => {
                console.log(err)
            })
            let data = await response.json()
            if(response.status === 200){
                setSchedulePeriodList(data)
                setLoading(false)
            }else{
                MySwal.fire({
                    icon: "error",
                    title: "Unexpected Error in viewing schedule form, Please Reload the page again"
                })
            }
        }   
        fetchData()
    }, [])

    return (
        <div id='AdminViewPeriodBase'>
            {loading?
                <>
                    fetching data
                </>
                :
                <>  
                    <div id='title'>
                        Schedule Form 
                    </div>
                    <div id='info'>
                        <div id='create' onClick={(e) => {navigate("../SetSchedule")}}>
                            Create Schedule Form
                        </div>
                        {schedulePeriodList.length === 0?
                            <>
                                <div style={{fontSize: "0.8em", marginTop: "2vh"}}>
                                    No data found. Please create schedule form.
                                </div>
                            </>
                            :
                            <>
                                {
                                    schedulePeriodList.map((data) => {
                                        return <Card key={data._id} data={data} setSchedulePeriodList={setSchedulePeriodList}/>
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
