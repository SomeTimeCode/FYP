import React, {useState ,useEffect} from 'react'
import { Link } from 'react-router-dom'


function Card(props){
    return(
        <>
            <Link to={`/supervisor/FYPTopics/${props.topic._id}`}>{props.topic.topic_name}</Link>
            <div>{props.topic.short_description}</div>
            <div>{props.topic.number_group}</div>
        </>
    )
}



function FYPTopics() {    
    const [page, setPage] = useState(1)
    const [topicList, setTopicList] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };

            let answer = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/view?page=${page}&limit=5`, requestOptions)
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else{
                    return []
                }
            }).then((data) => {
                if(data !== []){
                    return data
                }else{
                    return []
                }
            })
            console.log(answer)
            setTopicList(answer)
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
                    <div id='Content'>
                        <Link to="/supervisor/FYPTopics/addTopic">AddTopic</Link>
                        {topicList.length !== 0 ?
                            <div>
                                {
                                    topicList.map((topic) => {
                                        return <Card key={topic.topic_name} topic={topic}/>
                                    })
                                }
                            </div>
                            :
                            <div>no data is found</div>   
                        }
                    </div>
                    <div id='Controller'>
                        <button disabled={page === 1} onClick={(e) => {setPage((page => page - 1)); setLoading(true)}}>{'<'}</button>
                        <p>{page}</p>
                        <button onClick={(e) => {setPage((page => page + 1)); setLoading(true)}}>{'>'}</button>
                    </div>
                </>
            }
        </>
    )
}


export default FYPTopics