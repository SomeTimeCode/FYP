import React, {useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "./SupervisorIndex.css"

function SupervisorIndex() {

    const hasFetchedData = useRef(false)
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async() => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/index`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            setData(data)
          }else{
            MySwal.fire({
                icon: "warning",
                title: data.message,
                text: "Please reload the page again"
            })
          }
          setLoading(false)
        }
        if(!hasFetchedData.current){
            fetchData()
            hasFetchedData.current = true;
        }
    }, [MySwal])

    return (
        <div id='SupervisorIndexBase'>
            {loading?
            <>
                fetching data
            </>
            :
            <>
                {data.username}, Welcome to the System
            </>
            }
        </div>
    )
}

export default SupervisorIndex
