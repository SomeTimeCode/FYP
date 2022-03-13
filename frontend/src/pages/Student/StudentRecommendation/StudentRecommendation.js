import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './StudentRecommendation.css'

function TopicCard(props){

    const navigate = useNavigate()

    return (
        <div className='TopicCard'  onClick={(e) => {navigate(`../FYPTopics/${props.topic}`)}}>
            <div>Topic Name: {props.info.topic_name}</div>
            <div className='genreList'>
                Genres:
                {
                    props.info.genre.map((item)=>{
                        return <div className='genre' key={`${props.topic}-${item}`}>{item}</div>
                    })
                }
            </div>
            <div>Supervisor: {props.info.supervisor}</div>
        </div>
    )
}


function Card(props){
    
    const [courseCode, setCourseCode] = useState("")
    const [gradePoint, setGradePoint] = useState(0)
    const [warningCourseCode, setWarningCourseCode] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const save = (e) => {
        if(props.inputCourses[courseCode] !== undefined){
            setWarningCourseCode(true)
        }else{
            disabled? setDisabled(false) : setDisabled(true)
            var tempInputCoruses = {...props.inputCourses}
            tempInputCoruses[courseCode] = gradePoint
            props.setInputCourses(tempInputCoruses)
        }
    }

    const remove = (e) => {
        var tempInputCoruses = {...props.inputCourses}
        delete tempInputCoruses[courseCode]
        props.setInputCourses(tempInputCoruses)
        props.setInputCoursesNumber(props.inputCoursesNumber - 1)
    }

    return(
        <div className='GradeInput'>
            <div className='GradeInfo'>
                <label>
                    Course Code:
                    <input type="text" value={courseCode} disabled={disabled} onChange={(e) => {setCourseCode(e.target.value)}} />
                    {warningCourseCode? <p>Course Code already exist</p> : <></>}
                </label>
                <label>
                    Grade Point:
                    <input type="number" min={0} max={4.3} value={gradePoint} disabled={disabled} onChange={(e) => {setGradePoint(e.target.value)}} />
                </label>
            </div>
            <div className='GradeController' >
                <div className="GradeSave" onClick={(e) => {save(e)}}>
                    Save
                </div>
                <div className='GradeRemove' onClick={(e) => {remove(e)}}>
                    Remove
                </div>
            </div>
        </div>
    )
}


function StudentRecommendation() {

    const [loading, setLoading] = useState(true)
    const MySwal = withReactContent(Swal)
    const [AI, setAI] = useState(0)
    const [Blockchains, setBlockchains] = useState(0)
    const [Fintech, setFintech] = useState(0)
    const [Game, setGame] = useState(0)
    const [Application, setApplication] = useState(0)

    const [inputCourses, setInputCourses] = useState({})
    const [inputCoursesNumber, setInputCoursesNumber] = useState(0)

    const [recommendTopic, setRecommendTopic] = useState({})
    const [recommendReady, setRecommendReady] = useState(false)

    useEffect(() => {
        const fetchData = async() => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/viewGenrePreferences `, requestOptions)
            let data = await response.json()
            if(response.status === 200){
                if(data.preferences === undefined){
                    setLoading(false)
                }else{
                    setAI(data.preferences['AI'])
                    setBlockchains(data.preferences['Blockchains'])
                    setFintech(data.preferences['Fintech'])
                    setGame(data.preferences['Game Development'])
                    setApplication(data.preferences['Web/Mobile Application'])
                    setLoading(false)
                }
            }else{
                MySwal.fire({
                    icon: "warning",
                    title: data.message,
                    text: "Please the page reload again"
                })
            }
        }
        fetchData()
      }, [])
    
    const submitPreferences = async(e) => {
        e.preventDefault()
        console.log("test")
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({AI: AI, Blockchains: Blockchains, Fintech: Fintech, 'Web/Mobile Application': Application, 'Game Development': Game})
        };
        var response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/updateGenrePreferences`, requestOptions).catch((err) => {throw err})
        var data = await response.json()
        if(response.status === 200){
            MySwal.fire({
                icon: "success",
                title: "Update Success"
            })
        }else{
            MySwal.fire({
                icon: 'warning',
                title: "Unexpected error please try again",
                text: data.message
            })
        }
    }

    const submitGrading = async(e) => {
        e.preventDefault()
        if(inputCoursesNumber === 0){
            MySwal.fire({
                icon: "warning",
                title: "Please input your courses grading before submission"
            })
        }else{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify(inputCourses)
            };
            var response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/student/getFYPTopicRecommendation`, requestOptions).catch((err) => {throw err})
            var data = await response.json()
            console.log(data)
            if(response.status === 200){
                setRecommendTopic(data.topic_list)
                setRecommendReady(true)
            }else{
                MySwal.fire({
                    icon: "warning",
                    title: data.message
                })
            }
        }
    }

    return (
        <div id='StudentRecommendationBase'>
            <>
                {loading?
                    <>fetching data please wait</>
                :   
                    <>
                        <div id='title'>
                            FYP Topic Selction Helper
                        </div>
                        <div>Genres Preferences Settings Form</div>
                        <form id='Rating' onSubmit={(e) => {submitPreferences(e)}}>
                            <label>
                                AI:
                                <input type="number" value={AI} min={0} max={5} onChange={(e) => {setAI(e.target.value)}} />
                            </label>
                            <label>
                                Blockchains:
                                <input type="number" value={Blockchains} min={0} max={5} onChange={(e) => {setBlockchains(e.target.value)}} />
                            </label>
                            <label>
                                Fintech:
                                <input type="number" value={Fintech} min={0} max={5} onChange={(e) => {setFintech(e.target.value)}} />
                            </label>
                            <label>
                                Game:
                                <input type="number" value={Game} min={0} max={5} onChange={(e) => {setGame(e.target.value)}} />
                            </label>
                            <label>
                                Application:
                                <input type="number" value={Application} min={0} max={5} onChange={(e) => {setApplication(e.target.value)}} />
                            </label>
                            <input id="submit" type="submit" value="Submit" />
                        </form>
                        <div id='inputCourses'>
                            <div id='info'>
                                Add Course Grade Points Data and Save the Record Before Submitting for Recommendations.
                            </div>
                            <div id="AddCourse" onClick={(e) => {setInputCoursesNumber(inputCoursesNumber + 1)}}>
                                Add Course
                            </div>
                            <div>
                                {
                                    Array.from(Array(inputCoursesNumber), (element, index) => {
                                        return <Card inputCourses={inputCourses} setInputCourses={setInputCourses} inputCoursesNumber={inputCoursesNumber} setInputCoursesNumber={setInputCoursesNumber} key={index}/>
                                    })
                                }
                            </div>
                            <div id="GradeSubmit" onClick={(e) => {submitGrading(e)}}>
                                Submit
                            </div>
                        </div>
                        <div id='Recommendation'>
                            {recommendReady?
                            <>
                            {Object.keys(recommendTopic).length === 0?
                                <>No Recommendation</>
                            :
                                <>
                                    {
                                        Object.keys(recommendTopic).map((topic) => {
                                            return <TopicCard keys={topic} info={recommendTopic[topic]} topic={topic}/>
                                        })
                                    }
                                </>
                            }
                            </>
                            :
                            <>Please Input Course Grading Data for getting recommendations</>
                            }
                        </div>
                    </>
                }
            </>
        </div>
    )
}

export default StudentRecommendation