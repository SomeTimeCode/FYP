import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function TopicDetail() {

    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(true)
    const [topic, setTopic] = useState()
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/topic/${params.id}`, requestOptions)
                                 .then((response) => {
                                     if(response.status === 200){
                                         return response
                                     }else{
                                        navigate('../StudentFYPTopics');
                                     }
                                 })
                                 .then((data) => data.json()).catch(err => console.log(err))
            console.log(response)
            setTopic(response)
            setLoading(false)
        }
        fetchData()
    }, [])

    // const createGroup = async(values) =>{
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    //         body: JSON.stringify({ username: `${values.username}`, password: `${values.password}` })
    //     };
    // }

    const createGroup = async (event) => {
        const { value: formValues } = await MySwal.fire({
            title: `Create Group - ${topic.topic.topic_name}_${topic.topic.group.length + 1}`,
            showCancelButton: true,
            showLoaderOnConfirm: true,
            html:
                `
                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" class="password-input" type="password">
                </div>
                `,
            focusConfirm: false,
            preConfirm: () => {
              if(document.getElementById('password').value === ""){
                MySwal.showValidationMessage('Required Password input')
              }
              return document.getElementById('password').value
            }
          })
          if (formValues) {
            MySwal.fire(JSON.stringify(formValues))
          }
    }

    return (
        <>
        {loading? 
            <div>loading</div>
        :
            <div>
                <button onClick={(e) => {createGroup(e)}}>createGroup</button>
                {topic.supervisor.username}
                {topic.topic.detail_description}
                {topic.topic.genre.map((genre) => {return <div key={genre}>{genre}</div>})}
            </div>
        }
        </>
    )
}

export default TopicDetail