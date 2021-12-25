import React, { useContext, useState} from 'react'
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';
import "./Login.css"

function Login() {
    const [correctLogin, setCorrectLogin] = useState(true)
    const navigate = useNavigate();
    const ctx = useContext(AuthContext)

    const formik = useFormik({
        initialValues: {
          username: '',
          password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: values => {
            const login = async (values) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: `${values.username}`, password: `${values.password}` })
                };
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/auth/login`, requestOptions)
                .then(async (response) => {
                    let data = await response.json()
                    if(response.status === 200){
                        console.log(data);
                        setCorrectLogin(true)
                        ctx.onLogin(data.token ,data.role)
                        alert("Login Successfully")
                        navigate(`/${data.role.toLowerCase()}`);
                    }else{
                        console.log(data.message)
                        if(data.message === "Wrong username or password"){
                            setCorrectLogin(false)
                        }
                    }
                })
                .catch(err => console.log(err))
            }
            login(values)
        },
    });

    return (
        <>
            <div id='LoginBase'>
                <div id='title'><p>FYP Management System</p></div>
                <form onSubmit={formik.handleSubmit}>
                    <div id="login"><p>Login</p></div>
                    <div id='input'>
                        <div style={{width: "100%", height: "30%"}}>
                            <label htmlFor="username">User Name:</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                            />
                        </div>
                        {formik.touched.username && formik.errors.username ? ( <div id='warning'> <p>{formik.errors.username}</p> </div> ) : null}
                    </div>
                    <div id='input'>
                        <div style={{width: "100%", height: "30%"}}>
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                        </div>
                        {formik.touched.password && formik.errors.password ? ( <div id='warning'> <p>{formik.errors.password}</p> </div> ) : null}
                    </div>      
                    <div>
                        {!correctLogin? <div id="warning"><p>Incorrect Email/Password Input. Please Try Again.</p></div> : null}
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );

}

export default Login


