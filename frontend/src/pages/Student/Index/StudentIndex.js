import React, {useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "./StudentIndex.css"

function StudentIndex() {
    
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
          let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/index`, requestOptions)
          let data = await response.json()
          if(response.status === 200){
            console.log(data)
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
        <div id='StudentIndexBase'>
            {loading?
            <>
                fetching data
            </>
            :
            <>
                {data.username}, Welcome to the System
                <div id='GroupStatus'>
                    {data.group_info.group_exist?
                        <>
                            Group Name: {data.group_info.group_name}
                            <br/>
                            Group Status: {data.group_info.group_status}
                            <br/>
                            Supervised: {data.group_info.supervisor}
                            <br/>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                {data.group_info.group_member_list.length > 1?
                                    <>
                                    {
                                    data.group_info.group_member_list.map((member, index) => {
                                        var check_member
                                        if(member !== data.username){
                                            check_member = member
                                        }else{
                                            check_member = ''
                                        }
                                        if(index === 0){
                                            return <p key={`${check_member}-${index}`}>Group Members: {check_member} </p>
                                        }else if(check_member === ''){
                                            return <p></p>
                                        }else{
                                            return <p style={{marginLeft: '1vw'}} key={`${check_member}-${index}`}>{check_member}</p>
                                        }
                                    })
                                    }
                                    </>
                                    :
                                    <></>
                                }
                            </div>
                        </>
                        :
                        <>
                            You don't have a group yet. Please apply one.
                        </>
                    }
                </div>
            </>
            }
        </div>
    )
}

export default StudentIndex
