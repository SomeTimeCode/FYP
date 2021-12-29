import React, {useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosAddCircle } from "react-icons/io"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import "./SupervisorFYPTopics.css"

function Card(props){
    const navigate = useNavigate()

    return(
        <>  
            <div className='topic' onClick={(e) => {navigate(`/supervisor/FYPTopics/${props.topic._id}`)}}>
                <div className='topicInfo'>
                    <p>Topic Name: {props.topic.topic_name}</p>
                    <p>Description: {props.topic.short_description}</p>
                    <p>Number of Groups Opening: {props.topic.number_group} &nbsp; &nbsp; &nbsp; Max Members per Groups: {props.topic.number_group_member}</p>
                    <p>Current Number of Groups: {props.topic.group.length}</p>
                    <p>Genre(s):
                        {
                            props.topic.genre.map((item) => {
                                return `${" "}${item}${" "}`
                            })
                        }
                    </p>
                </div>
            </div>
        </>
    )
}



function SupervisorFYPTopics() {
    const navigate = useNavigate()
    const [lastPage, setLastPage] = useState(false)    
    const [page, setPage] = useState(1)
    const [topicList, setTopicList] = useState([])
    const [loading, setLoading] = useState(true)

    const formik = useFormik({
        initialValues: {
          topic_name: '',
          genre: [],
        },
        validationSchema: Yup.object({
            topic_name: Yup.string(),
            genre: Yup.array()
        }),
        onSubmit: values => {
            const searchTopic = async(values) =>{
                if(page === 1){
                    var genre = values.genre.map((item) => {
                    return item.value
                    })
                    const requestOptions = {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    };
                        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/view?page=${page}&limit=4&topic_name=${values.topic_name}&genre=${genre}`, requestOptions)
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
                }else{
                    setPage(1)
                }
            }
            searchTopic(values)
        },
    });

    const genreOptions = [
        {
            label: "Web/Mobile Application",
            value: "Web/Mobile Application"
        },
        {
            label: "AI",
            value: "AI"
        },
        {
            label: "BlockChains",
            value: "BlockChains"
        },
        {
            label: "Fintech",
            value: "Fintech"
        },
        {
            label: "Game Development",
            value: "Game Development"
        },
        {
            label: "Others",
            value: "Others"
        }
    ]




    useEffect(() => {
        const fetchData = async () => {
            var genre = formik.values.genre.map((item) => {
                return item.value
            })
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/view?page=${page}&limit=4&topic_name=${formik.values.topic_name}&genre=${genre}`, requestOptions)
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
                        <div id='search'>
                            <form onSubmit={formik.handleSubmit}>
                                <label>Topic Name: </label>
                                <div className='input'>
                                    <input
                                        id="topic_name"
                                        name="topic_name"
                                        type="text"
                                        placeholder='Topic Name'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.topic_name}
                                    />
                                </div>
                                <div className='inputGenre'>
                                    <label>Genre: </label>
                                    <Select
                                        defaultValue={
                                            formik.values.genre
                                        }
                                        styles={{ valueContainer: () => {return {width:"75%", maxHeight: "3vh",overflowY: "scroll"}}}}
                                        className='inputGenreSelect'
                                        options={genreOptions}
                                        isMulti={true}
                                        id="genre"
                                        name="genre"
                                        placeholder="Select Genres"
                                        onChange={(e) => {
                                            formik.values.genre = e
                                            console.log(formik.values.genre)
                                        }}
                                    />
                                </div>
                                <div id='submit'>
                                    <button type="submit">Search</button>
                                </div>
                            </form>
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
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", alignItems: "center", height: "70%"}}>
                                <p style={{fontSize: "3vh", marginBottom: "2vh"}}>We haven't found any related Topics in this page</p>
                                <p style={{fontSize: "2vh"}}>Please create new Topic</p>
                            </div>   
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


export default SupervisorFYPTopics