import React, {useState} from 'react'
import { useFormik } from 'formik';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

function AddTopic() {
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState(1)

    const formik = useFormik({
        initialValues: {
            topic_name: '',
            short_description: '',
            detail_description: '',
            genre: [],
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
            const addTopic = async(values) =>{
                var genre = values.genre.map((item) => {
                    return item.value
                })
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    body: JSON.stringify({topic_name: values.topic_name, short_description: values.short_description, detail_description: values.detail_description, genre: genre, number_group: values.number_group })
                };
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/topic/create`, requestOptions).then(async (response) =>{
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
        <div>
            <form onSubmit={formik.handleSubmit}>
            <label htmlFor="topic_name">topic_name</label>
            <input
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
                options={genreOptions}
                isMulti={true}
                id="genre"
                name="genre"
                placeholder="Select Genres"
                onChange={(e) => {
                    formik.values.genre = e
                    console.log(e.length)
                    console.log(selectedValue)
                    setSelectedValue(e.length)
                    console.log(formik.values.genre)
                }}
            />
            {selectedValue === 0? (
                <div>Required</div>
            ) : null}
            <button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default AddTopic;