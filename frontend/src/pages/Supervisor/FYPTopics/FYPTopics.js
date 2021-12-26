import React, {useState ,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosAddCircle } from "react-icons/io";
import "./FYPTopics.css"

function Card(props){
    const navigate = useNavigate()

    return(
        <>  
            <div className='topic' onClick={(e) => {navigate(`/supervisor/FYPTopics/${props.topic._id}`)}}>
                <div className='topicInfo'>
                    <p>Topic Name: {props.topic.topic_name}</p>
                    <p>Description: {props.topic.short_description}</p>
                    <p>Number of Groups Opening: {props.topic.number_group}</p>
                    <p>Current Number of Groups: {props.topic.group.length}</p>
                </div>
            </div>
        </>
    )
}



function FYPTopics() {
    const navigate = useNavigate()
    const [lastPage, setLastPage] = useState(false)    
    const [page, setPage] = useState(1)
    const [topicList, setTopicList] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };

            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/view?page=${page}&limit=5`, requestOptions)
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else{
                    return []
                }
            }).then((data) => {
                if(data.length !== 0){
                    return data
                }else{
                    return {topic_list: [], last: true}
                }
            })
            console.log(response)
            setLastPage(response.last)
            setTopicList(response.topic_list)
            setLoading(false)
        }
        fetchData()
    }, [page])

    return (
        <>
            {loading ?
                <div>Fetching Data</div>
            :   
                <>
                    <div id='FYPTopicsBase'>
                        <div id='AddTopicButton'>
                            <p id='iconTitle'>AddTopic</p>
                            <IoIosAddCircle id="icon" onClick={(e) => {navigate("/supervisor/FYPTopics/addTopic")}}/>
                        </div>
                        <div id='title'>
                            <p>FYP Topics</p>
                        </div>
                        {topicList.length !== 0 ?
                            <div id='topicList'>
                                {
                                    topicList.map((topic) => {
                                        return <Card key={topic.topic_name} topic={topic}/>
                                    })
                                }
                            </div>
                            :
                            <div>no data is found</div>   
                        }
                        <div id='Controller'>
                            <button disabled={page === 1} onClick={(e) => {setPage((page => page - 1)); setLoading(true)}}>{'<'}</button>
                            <p>{page}</p>
                            <button disabled={lastPage} onClick={(e) => {setPage((page => page + 1)); setLoading(true)}}>{'>'}</button>
                        </div>
                    </div>
                </>
            }
        </>
    )
}


export default FYPTopics