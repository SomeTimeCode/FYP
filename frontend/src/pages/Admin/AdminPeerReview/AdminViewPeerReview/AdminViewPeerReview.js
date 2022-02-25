import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './AdminViewPeerReview.css'

function Card(props){

    const navigate = useNavigate()

    return (
        <div className='form' onClick={(e) => {navigate(`../EditPeerReview/${props.form._id}`)}}>
            <p>Term: {props.form.term}</p><br />
            <p>Start of Date: {props.form.start_of_date.slice(0,10)}</p><br />
            <p>End of Date: {props.form.end_of_date.slice(0,10)}</p><br />
            <p>Number of Question(s): {props.form.questions}</p><br />
        </div>
    )
}


function AdminViewPeerReview() {
    
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewPeerReview`, requestOptions).catch((err) => {
                console.log(err)
            })
            let data = await response.json()
            if(response.status !== 200){
                MySwal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: data.message,
                    confirmButtonColor: '#3085d6',
                })
                .then(() => {
                    return navigate(`../`);
                })
            }
            console.log(data)
            setResult(data)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div id='AdminViewPeerReviewBase'>
            <div id='title'>
                <p>Peer Review</p>
            </div>
            <div id='create'>
                <div id='button' onClick={() => navigate('../CreatePeerReview')}>
                    <p>Create Peer Review</p>
                </div>
            </div>
            <div id='result'>
                {loading?
                    <>
                        fetching data
                    </>
                :   
                    <>
                    {(result === null || Object.keys(result).length === 0)?
                        <>
                            No Results
                        </>
                    :   
                        <>
                        {result.map((form) => {return (<Card key={form._id} form={form}/>)})}
                        </> 
                    }
                    </>
                }
            </div>
        </div>
    )
}

export default AdminViewPeerReview