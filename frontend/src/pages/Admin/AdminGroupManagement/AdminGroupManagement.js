import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './AdminGroupManagement.css'


function Card(props){

  const MySwal = withReactContent(Swal)
  const [groupStatus, setGroupStatus] = useState(props.data.status)
  const [examiner, setExaminer] = useState(props.data.examiner)

  const update = async(e) => {
    await MySwal.fire({
      icon: "question",
      title: "Are you sure to update?",
      confirmButtonText: "YES",
      cancelButtonText: "NO",
      showCancelButton: true,
      showConfirmButton: true
    }).then(async (result) => {
      if(!result.isConfirmed){
        return
      }else if(examiner === props.data.supervisor){
        MySwal.fire({
          icon: "warning",
          title: "Examiner cannot be the same as supervisor"
        }).then((result) => {
          return
        })
      }else{
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          body: JSON.stringify({ _id: props.data._id, status: groupStatus, examiner: examiner })
        };
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/updateGroup`, requestOptions)
        let data = await response.json()
        if(response.status === 200){
          MySwal.fire({
            icon: 'success',
            title: data.message
          })
        }else{
          MySwal.fire({
            icon: "warning",
            title: data.message,
            text: data.error,
          })
        }
      }
    })
  }


  return (
    <div className='CardBase'>
      <p>{props.data.group_name}</p>
      <label>Group's status:</label>
      <select onChange={(e) => {setGroupStatus(e.target.value)}} value={groupStatus}>
        <option value="pending">pending</option>
        <option value="approve">approve</option>
      </select>
      <br/>
      <p>Group's supervisor: {props.data.supervisor}</p>
      <label>Group's examiner: </label>
      <input type="text" value={examiner === null?'':examiner} onChange={(e) => {setExaminer(e.target.value)}}/>
      <div className='update' onClick={(e) => update(e)}>
        Update
      </div>
    </div>
  )
}




function AdminGroupManagement() {

  const hasFetchedData = useRef(false)
  const MySwal = withReactContent(Swal)
  const navigate = useNavigate()
  const [data, setData] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        };
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewGroups`, requestOptions)
        let data = await response.json()
        if(response.status === 200){
          setData(data)
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
}, [MySwal, navigate])


  return (
    <div id='AdminGroupManagementBase'>
      <div id='title'>
        Admin Group Management
      </div>
      <div id='CardList'>
        {loading?
          <>fetching Data</>
        :
          <>
          {data.length === 0?
            <>No any groups yet</>
          :
            <>
            {
              data.map((group) => {
                return <Card data={group} key={group._id}/>
              })
            }
            </>
          }
          </>
        }
      </div>
    </div>
  )
}

export default AdminGroupManagement