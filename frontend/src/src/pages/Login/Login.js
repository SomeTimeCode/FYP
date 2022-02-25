import React, { useContext, useState} from 'react'
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "./Login.css"


function Login() {
    
    const MySwal = withReactContent(Swal)
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
                    body: JSON.stringify({ username: values.username, password: values.password })
                };
                await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/auth/login`, requestOptions)
                .then(async (response) => {
                    let data = await response.json()
                    if(response.status === 200){
                        ctx.onLogin(data.token ,data.role)
                        MySwal.fire({
                            title: <p>Login Success</p>,
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                        }).then(() => {
                            return navigate(`/${data.role.toLowerCase()}`);
                        })
                    }else{
                        MySwal.fire({
                            title: <p>Fail to Login</p>,
                            text: data.message,
                            icon: "error"
                        }).then(() => {
                            setCorrectLogin(false)
                        })
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
                    <div className='inputBase'>
                        <div className='input'>
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
                        {formik.touched.username && formik.errors.username ? ( <div className='warning'> <p>{formik.errors.username}</p> </div> ) : null}
                    </div>
                    <div className='inputBase'>
                        <div className='input'>
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
                        {formik.touched.password && formik.errors.password ? ( <div className='warning'> <p>{formik.errors.password}</p> </div> ) : null}
                    </div>      
                    {!correctLogin? <div id='inCorrectLogin'><p>Fail to Login the FYP Management System. Please Try Login Again.</p></div> : null}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );

}

export default Login


