import React, {useState ,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import './SupervisorGroup.css'

function Card(props){
    const navigate = useNavigate()

    return(
        <>  
            <div className='topic' onClick={(e) => {navigate(`/supervisor/Groups/${props.topic._id}`)}}>
                <div className='topicInfo'>
                    <p>Topic Name: {props.topic.topic_name}</p>
                    <p>Description: {props.topic.short_description}</p>
                    <p>Genre(s):
                        {
                            props.topic.genre.map((item) => {
                                return `${" "}${item}${" "}`
                            })
                        }
                    </p>
                </div>
                {props.topic.pending ? <div className='pending' style={{display: props.topic.pending, backgroundColor: "red", width: "5%"}}></div> : null}
            </div>
        </>
    )
}

function SupervisorGroup() {
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
                        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/view?page=${page}&limit=5&topic_name=${values.topic_name}&genre=${genre}`, requestOptions)
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
            label: "Blockchains",
            value: "Blockchains"
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
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/view?page=${page}&limit=5&topic_name=${formik.values.topic_name}&genre=${genre}`, requestOptions)
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
                    <div id='GroupsBase'>
                        <div id='title'>
                            <p>Group Manage</p>
                        </div>
                        <div id='search'>
                            <form onSubmit={formik.handleSubmit}>
                                <div className='input'>
                                    <label>Topic:</label>
                                    <input
                                        id="topic_name"
                                        name="topic_name"
                                        type="search"
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
                                        styles={{ 
                                            valueContainer: () => {return {display: "flex", flexDirection: "row", flexWrap: "wrap", maxHeight: "3vh",width:"80%",overflow: "auto"}}, 
                                            indicatorsContainer: () => {return { width:"20%", display: "flex", flexDirection: "row" }},
                                            multiValue: () => {return {minWidth: "4vw", display:"flex", flexDirection: "row", backgroundColor: "#D3D3D3", borderRadius: "3px", marginRight: "0.3vw"}}
                                        }}
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
                                <button type="submit">Search</button>
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
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", alignItems: "center", minHeight: "70vh"}}>
                                <p style={{fontSize: "3vh", marginBottom: "2vh"}}>We haven't found any related Topics in this page</p>
                                <p style={{fontSize: "2vh"}}>Please create new Topic <Link to="../FYPTopics/addTopic">here</Link></p>
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


export default SupervisorGroup