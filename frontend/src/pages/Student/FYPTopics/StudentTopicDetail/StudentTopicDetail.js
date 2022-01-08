import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './StudentTopicDetail.css'

function StudentTopicDetail() {

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
                                        navigate('../FYPTopics');
                                     }
                                 })
                                 .then((data) => data.json()).catch(err => console.log(err))
            console.log(response)
            setTopic(response)
            setLoading(false)
        }
        fetchData()
    }, [])

    const joinGroup = async (key, state) => {
        if(topic.topic.group[key].member.length >= topic.topic.number_group_member){
            MySwal.fire({
                title: `This group already full`,
                timer: 3000,
                icon: 'warning',
            })
            return
        }
        if(Object.keys(topic.student).length !== 0){
            MySwal.fire({
                title: `You have a group already`,
                timer: 3000,
                icon: 'warning',
            })
            return
        }
        if(state){
            //public group without password
            const {value} = await MySwal.fire({
                title: `Are you suer to join this group ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Join',
            })
            if(value){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({_id: key})
                };
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/topic/joinGroup`, requestOptions).then(async (response) =>{
                    let data = await response.json()
                    if(response.status === 200){
                        console.log(data)
                        MySwal.fire({
                            title: <p>Join Group Success</p>,
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                        })
                        .then(() => {
                            return navigate(`../FYPTopics`);
                        })
                    }else{
                        MySwal.fire({
                            title: <p>{data.message}</p>,
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                        })
                    }
                })
            }
        }else{
            const {value: password} = await MySwal.fire({
                showCancelButton: true,
                input: 'password',
                inputValue: '',
                inputPlaceholder: 'Password',
                confirmButtonText: 'Join',
                inputValidator: (result) => {
                    return !result && 'You need to input password to create private group'
                }
            })
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({_id: key, password: password})
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/topic/joinGroup`, requestOptions).then(async (response) =>{
                let data = await response.json()
                if(response.status === 200){
                    console.log(data)
                    MySwal.fire({
                        title: <p>Join Group Success</p>,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    })
                    .then(() => {
                        return navigate(`../FYPTopics`);
                    })
                }else{
                    MySwal.fire({
                        title: <p>{data.message}</p>,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                    })
                }
            })
        }
        // console.log(state)
        // console.log('hi')
    }

    const createGroup = async (event) => {
        const { value: accept } = await MySwal.fire({
            title: `Create Group - ${topic.topic.topic_name}_${Object.keys(topic.topic.group).length === 0 ? `1` : `${Object.keys(topic.topic.group).length + 1}` }`,
            showCancelButton: true,
            // document.getElementsByClassName('form-input').style.display="block"
            input: 'checkbox',
            inputValue: 0,
            inputPlaceholder: 'Set Group to Public',
            confirmButtonText: 'Continue <i class="fa fa-arrow-right"></i>',
        })
        if(accept === 1){
            //public group
            var group_name = `${topic.topic.topic_name}_${Object.keys(topic.topic.group).length === 0 ? `1` : `${Object.keys(topic.topic.group).length + 1}` }`
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({id: `${params.id}`, group_name: group_name})
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/topic/createGroup`, requestOptions).then(async (response) =>{
                let data = await response.json()
                if(response.status === 200){
                    console.log(data)
                    MySwal.fire({
                        title: <p>Group Create Success</p>,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    })
                    .then(() => {
                        return navigate(`../FYPTopics`);
                    })
                }else{
                    MySwal.fire({
                        title: <p>{data.message}</p>,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                    })
                }
            })
        }else{
            //ask for pw
            var group_name = `${topic.topic.topic_name}_${Object.keys(topic.topic.group).length === 0 ? `1` : `${Object.keys(topic.topic.group).length + 1}` }`
            const {value: password} = await MySwal.fire({
                title: `Create Group - ${topic.topic.topic_name}_${Object.keys(topic.topic.group).length === 0 ? `1` : `${Object.keys(topic.topic.group).length + 1}` }`,
                showCancelButton: true,
                input: 'password',
                inputValue: '',
                inputPlaceholder: 'Password',
                confirmButtonText: 'Create',
                inputValidator: (result) => {
                    return !result && 'You need to input password to create private group'
                }
            })
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({id: `${params.id}`, password: password, group_name: group_name})
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/topic/createGroup`, requestOptions).then(async (response) =>{
                let data = await response.json()
                if(response.status === 200){
                    console.log(data)
                    MySwal.fire({
                        title: <p>Group Create Success</p>,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    })
                    .then(() => {
                        return navigate(`../FYPTopics`);
                    })
                }else{
                    MySwal.fire({
                        title: <p>{data.message}</p>,
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                    })
                }
            })
        }
    }

    return (
        <>
        {loading? 
            <div>loading</div>
        :
            <div id='StudentTopicDetailBase'>
                <div id='content'>
                    <p>Topic: {topic.topic.topic_name} &nbsp;Supervisor: {topic.supervisor.name}</p>
                    <p>Description: {topic.topic.detail_description? topic.topic.detail_description : topic.topic.short_description}</p>
                    <p>Genre: {topic.topic.genre.map((item) => {return `${item}`})}</p>
                    <p>Number of Members allowed per Group: {topic.topic.number_group_member}</p>
                </div>
                <div id='createGroups'>
                    <p>{Object.keys(topic.student).length !== 0 ? `You have a group already` : (topic.topic.number_group === 0 ? `This topic has reached the max number of groups` : `Create a New Group`)}</p>
                    <button disabled={topic.topic.number_group === 0 || Object.keys(topic.student).length !== 0 } onClick={(e) => {createGroup(e)}}>CreateGroup</button>
                </div>
                <div id='joinGroups'>
                    <p>{Object.keys(topic.topic.group).length === 0? 'Do not have any group now' : 'Click the above to join'} </p>
                    {Object.keys(topic.topic.group).map((key) => {
                        return (
                            <div className='group' key={key} id={key} onClick={(e) => {joinGroup(key, topic.topic.group[key].public)}}>
                                <div className='info'>
                                    <p>Group Leader: {topic.topic.group[key].member[0].username}</p>
                                    <p>Contact:{topic.topic.group[key].member[0].contact}</p>
                                </div>
                                <div className='state'>
                                    <p>{topic.topic.group[key].member.length >= topic.topic.number_group_member ? 'Full' : (topic.topic.group[key].public? 'Public Group' : `Private Group`)}</p>
                                </div>
                            </div>
                            
                        )
                    })}
                </div>
            </div>
        }
        </>
    )
}

export default StudentTopicDetail