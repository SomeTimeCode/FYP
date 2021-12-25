import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function TopicDetail() {

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
                                        // navigate('../StudentFYPTopics');
                                     }
                                 })
                                 .then((data) => data.json()).catch(err => console.log(err))
            console.log(response)
            setTopic(response)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <>
        {loading? 
            <div>loading</div>
        :
            <div>
                {topic.supervisor.username}
                {topic.topic.detail_description}
                {topic.topic.genre.map((genre) => {return <div key={genre}>{genre}</div>})}
            </div>
        }
        </>
    )
}

export default TopicDetail