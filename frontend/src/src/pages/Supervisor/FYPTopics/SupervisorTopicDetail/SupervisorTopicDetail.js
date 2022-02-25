import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import Select from "react-select";
import * as Yup from 'yup';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './SupervisorTopicDetail.css'

function SupervisorTopicDetail() {

    const MySwal = withReactContent(Swal)
    const params = useParams();
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState(-1)
    const [selectedOptions, setSelectedOptions] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [minOpening, setMinOpening] = useState(0)
    const [loading, setLoading] = useState(true)
    
    const formik = useFormik({
        initialValues: {
            topic_name: '',
            short_description: '',
            detail_description: '',
            genre: [],
            number_group_member: '',
            number_group: '',
        },
        validationSchema: Yup.object({
            topic_name: Yup.string()
            .max(30, 'Must be 30 characters or less')
            .required('Topic name is required'),
            short_description: Yup.string()
            .max(100, 'Must be 100 characters or less')
            .required('Short Description about the topic is required'),
            detail_description: Yup.string(),
            genre: Yup.array().min(1).required("At leasat 1 genre is required to select"),
            number_group: Yup.number().min(minOpening).required('At least 1 open group is required for students to apply'),
            number_group_member: Yup.number().min(1).required('At least 1 student per group is required')
        }),
        onSubmit: values => {
            MySwal.fire({
                title: <p>Are You Sure to make change?</p>,
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: "No",
                cancelButtonColor: "#FF0000",
                confirmButtonText: "Yes",
                confirmButtonColor: '#3085d6',
            }).then(async (result) => {
                    if (result.isConfirmed) {
                        var genre = values.genre.map((item) => {
                            return item.value
                        })
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                            body: JSON.stringify({_id: params.id ,topic_name: values.topic_name, short_description: values.short_description, detail_description: values.detail_description, genre: genre, number_group: values.number_group, number_group_member: values.number_group_member })
                        };
                        await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/update`, requestOptions).then(async (response) =>{
                            let data = await response.json()
                            if(response.status === 200){
                                MySwal.fire({
                                    title: <p>Successfully Updated</p>,
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                }).then(() => {
                                    return navigate(`../FYPTopics`);
                                })
                            }else{
                                MySwal.fire({
                                    title: data.message,
                                    icon: 'error',
                                    confirmButtonColor: '#3085d6',
                                })
                            }
                        })
                    }
            })
        },
      });

    const deleteTopicHandler = async () => {
        MySwal.fire({
            title: <p>Are You Sure to Delete?</p>,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: "No",
            cancelButtonColor: "#FF0000",
            confirmButtonText: "Yes",
            confirmButtonColor: '#3085d6',
          }).then(async (result) => {
                if (result.isConfirmed) {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                        body: JSON.stringify({_id: params.id })
                    };
                    await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/delete`, requestOptions).then(async (response) =>{
                        let data = await response.json()
                        if(response.status === 200){
                            return (
                                MySwal.fire({
                                    title: <p>Successfully Deleted</p>,
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                })
                                .then(() => {
                                    return navigate(`../FYPTopics`);
                                })
                            )
                        }else{
                            MySwal.fire({
                                title: data.message,
                                icon: 'error',
                                confirmButtonColor: '#3085d6',
                            })
                        }
                    })
                }
        })
    }

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
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/${params.id}`, requestOptions)
                                 .then((response) => {
                                     if(response.status === 200){
                                         return response
                                     }else{
                                        navigate('../FYPTopics');
                                     }
                                 })
                                 .then((data) => data.json()).catch(err => console.log(err))
            var genre_list = response.genre.map((item) => {return {label: item, value: item}})
            setSelectedOptions(genre_list)
            formik.setValues({"topic_name": response.topic_name, "short_description":response.short_description, "detail_description":response.detail_description,"genre":genre_list, "number_group":response.number_group, "number_group_member": response.number_group_member});
            if(response.group.length === 0){
                setMinOpening(1)
            }
            setLoading(false)
        }
        fetchData()
    },[])

    return (
        <>
        {loading ? 
            <div>Data is loading</div>
            :
            <div id='AdjustTopicBase'>
                <div id='controller'>
                    {disabled? 
                        <button type='button' style={{backgroundColor: "green"}} onClick={(e) => {setDisabled(!disabled)}}>Edit</button>
                    :
                        <>  
                            <button type='button' style={{backgroundColor: "yellow"}} onClick={(e) => {setDisabled(!disabled)}}>Save</button>
                            <button type="submit" style={{backgroundColor: "blue"}} onClick={formik.handleSubmit}>Submit</button>
                            <button type="button" style={{backgroundColor: "red"}} onClick={(e) => deleteTopicHandler(e)}>Delete</button>
                        </>
                    }
                </div>
                <div id='AdjustTopicForm'>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='inputBase'>
                            <div className='input'>
                                <label htmlFor="topic_name">Topic Name:</label>
                                <input
                                    disabled={disabled}
                                    id="topic_name"
                                    name="topic_name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.topic_name}
                                />
                            </div>
                            {formik.touched.topic_name && formik.errors.topic_name ? (
                                <div className='warning'>{formik.errors.topic_name}</div>
                            ) : null}
                        </div>

                        <div className='inputBase'>
                            <div className='input'>
                                <label htmlFor="short_description">Short Description:</label>
                                <input
                                    disabled={disabled}
                                    id="short_description"
                                    name="short_description"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.short_description}
                                />
                            </div>
                            {formik.touched.short_description && formik.errors.short_description ? (
                                <div className='warning'>{formik.errors.short_description}</div>
                            ) : null}
                        </div>

                        <div className='inputBase'>
                            <div className='input'>
                                <label htmlFor="detail_description">Detail Description:</label>
                                <input
                                    disabled={disabled}
                                    id="detail_description"
                                    name="detail_description"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.detail_description}
                                />
                            </div>
                        </div>

                        <div className='inputBase'>
                            <div className='input'>
                                <label htmlFor="number_group">Number of Open Group(s):</label>
                                <input
                                    disabled={disabled}
                                    id="number_group"
                                    name="number_group"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.number_group}
                                />
                            </div>
                            {formik.touched.number_group && formik.errors.number_group ? (
                                <div className='warning'>{formik.errors.number_group}</div>
                            ) : null}
                        </div>
                    
                        <div className='inputBase'>
                            <div className='input'>
                                <label htmlFor="number_group_member">Maximum student(s) per group:</label>
                                <input
                                    disabled={disabled}
                                    id="number_group_member"
                                    name="number_group_member"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.number_group_member}
                                />
                            </div>
                            {formik.touched.number_group_member && formik.errors.number_group_member ? (
                                <div className='warning'>{formik.errors.number_group_member}</div>
                            ) : null}
                        </div>
                        <div className='inputBase'>
                            <div className='input'>
                                <label htmlFor="genre">Genre(s):</label>
                                <Select
                                    isDisabled={disabled}
                                    options={genreOptions}
                                    isMulti={true}
                                    id="genre"
                                    name="genre"
                                    placeholder="Select Genres"
                                    value={selectedOptions}
                                    onChange={(e) => {
                                        formik.values.genre = e
                                        setSelectedValue(e.length)
                                        setSelectedOptions(e)
                                    }}
                                />
                            </div>
                            {formik.touched.genre && formik.errors.genre? (
                                (selectedValue === -1 || selectedValue === 0? 
                                    <div className='warning'>At leasat 1 genre is required to select </div>
                                :
                                null
                            )
                            ) : (selectedValue === 0 ? 
                                    <div className='warning'>At leasat 1 genre is required to select </div>
                                :
                                null
                            )}
                        </div>
                    </form>
                </div>
            </div>
        }
        </>
    )
}

export default SupervisorTopicDetail