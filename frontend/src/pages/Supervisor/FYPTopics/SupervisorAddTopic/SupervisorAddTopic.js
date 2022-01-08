import React, {useState} from 'react'
import { useFormik } from 'formik';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './SupervisorAddTopic.css'

function SupervisorAddTopic() {
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState(-1)

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
            number_group: Yup.number().min(1).required('At least 1 open group is required for students to apply'),
            number_group_member: Yup.number().min(1).required('At least 1 student per group is required')
        }),
        onSubmit: values => {
            const addTopic = async(values) =>{
                var genre = values.genre.map((item) => {
                    return item.value
                })
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({topic_name: values.topic_name, short_description: values.short_description, detail_description: values.detail_description, genre: genre, number_group: values.number_group , number_group_member: values.number_group_member})
                };
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/create`, requestOptions).then(async (response) =>{
                    let data = await response.json()
                    if(response.status === 200){
                        MySwal.fire({
                            title: <p>Successfully Create New Topic</p>,
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
            addTopic(values)
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
    
    return (
        <div id='AddTopicBase'>
            <div id='AddTopicTitle'>
                <p>Topic Submission Form</p>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='inputBase'>
                    <div className='input'>
                        <label htmlFor="topic_name">Topic Name:</label>
                        <input
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
                            options={genreOptions}
                            isMulti={true}
                            id="genre"
                            name="genre"
                            placeholder="Select Genres"
                            onChange={(e) => {
                                formik.values.genre = e
                                setSelectedValue(e.length)
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
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default SupervisorAddTopic;