import React, {useState, useEffect} from 'react'

function GroupSchedule() {

    const [schedule, setSchedule] = useState({})

    useEffect(() => {
        const fetchData = async() => {
          const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          };
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/viewSpecificPeerReviewForm/`, requestOptions)
          let data = await response.json()
        }
        fetchData()
      }, [])


    return (
        <>
        <div>GroupSchedule</div>
        <table border="1">
            <tr>
                <td>Session/Day</td>
                <td>Monday</td>
                <td>Tuesday</td>
                <td>Wednesday</td>
                <td>Thursday</td>
                <td>Friday</td>
            </tr>
            <tr>
                <td>9:00 - 9:20</td>
                <td>Testing</td>
                <td>Testing</td>
                <td>Testing</td>
                <td>Testing</td>
                <td>Testing</td>
            </tr>
        </table>
        </>
    )
}

export default GroupSchedule