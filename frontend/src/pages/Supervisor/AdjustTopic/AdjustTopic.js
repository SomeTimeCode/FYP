import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import Select from "react-select";
import * as Yup from 'yup';

function AdjustTopic() {

    const params = useParams();
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState(1)
    const [selectedOptions, setSelectedOptions] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(true)
    
    const formik = useFormik({
        initialValues: {
            topic_name: '',
            short_description: '',
            detail_description: '',
            genre: '',
            number_group: '',
        },
        validationSchema: Yup.object({
            topic_name: Yup.string()
            .max(30, 'Must be 30 characters or less')
            .required('Required'),
            short_description: Yup.string()
            .max(100, 'Must be 100 characters or less')
            .required('Required'),
            detail_description: Yup.string(),
            genre: Yup.array().min(1).required("Required"),
            number_group: Yup.number().min(1).required('Required')
        }),
        onSubmit: values => {
            const updateTopic = async(values) =>{
                var genre = values.genre.map((item) => {
                    return item.value
                })
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({_id: params.id ,topic_name: values.topic_name, short_description: values.short_description, detail_description: values.detail_description, genre: genre, number_group: values.number_group })
                };
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/update`, requestOptions).then(async (response) =>{
                    let data = await response.json()
                    if(response.status === 200){
                        console.log(data)
                        alert(JSON.stringify(values, null, 2));
                        alert("Submitted Successfully")
                        navigate(`../FYPTopics`);
                    }else{
                        alert(data.message)
                        return
                    }
                })
            }
            updateTopic(values)
        },
      });

    const deleteTopicHandler = async (event) => {
        const deleteTopic = async() =>{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({_id: params.id })
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/delete`, requestOptions).then(async (response) =>{
                let data = await response.json()
                if(response.status === 200){
                    console.log(data)
                    alert("Submitted Successfully")
                    navigate(`../FYPTopics`);
                }else{
                    alert(data.message)
                    return
                }
            })
        }
        deleteTopic()
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
            console.log(response)
            console.log(response.genre)
            var genre_list = response.genre.map((item) => {return {label: item, value: item}})
            console.log(genre_list)
            setSelectedOptions(genre_list)
            formik.setValues({"topic_name": response.topic_name, "short_description":response.short_description, "detail_description":response.detail_description,"genre":genre_list, "number_group":response.number_group});
            setLoading(false)
        }
        fetchData()
    },[])

    return (
        <>
        {loading ? 
            <div>Data is loading</div>
            :
            <div>
                {disabled? <button type='button' onClick={(e) => {setDisabled(!disabled)}}>Edit</button>:
                    <div>
                        <button type="button" onClick={(e) => deleteTopicHandler(e)}>Delete</button>
                        <button type='button' onClick={(e) => {setDisabled(!disabled)}}>Save</button>
                        <button type="submit" onClick={formik.handleSubmit}>Submit</button>
                    </div>
                }
                <form onSubmit={formik.handleSubmit}>
                <label htmlFor="topic_name">topic_name</label>
                <input
                    disabled={disabled}
                    id="topic_name"
                    name="topic_name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.topic_name}
                />
                {formik.touched.topic_name && formik.errors.topic_name ? (
                    <div>{formik.errors.topic_name}</div>
                ) : null}
            
                <label htmlFor="short_description">short_description</label>
                <input
                    disabled={disabled}
                    id="short_description"
                    name="short_description"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.short_description}
                />
                {formik.touched.short_description && formik.errors.short_description ? (
                    <div>{formik.errors.short_description}</div>
                ) : null}
            
                <label htmlFor="detail_description">detail_description</label>
                <input
                    disabled={disabled}
                    id="detail_description"
                    name="detail_description"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.detail_description}
                />
                {formik.touched.detail_description && formik.errors.detail_description ? (
                    <div>{formik.errors.detail_description}</div>
                ) : null}

                <label htmlFor="number_group">number_group</label>
                <input
                    disabled={disabled}
                    id="number_group"
                    name="number_group"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.number_group}
                />
                {formik.touched.number_group && formik.errors.number_group ? (
                    <div>{formik.errors.number_group}</div>
                ) : null}

                <label htmlFor="genre">genre</label>
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
                {selectedValue === 0? (
                    <div>Required</div>
                ) : null}
                </form>
            </div>
        }
        </>
    )
}

export default AdjustTopic