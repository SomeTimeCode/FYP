import React, { useContext, useState} from 'react'
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';

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
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="username">username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? ( <div> {formik.errors.username} </div> ) : null}

                    <label htmlFor="password">password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? ( <div> {formik.errors.password} </div> ) : null}
                    <button type="submit">Submit</button>
                    <div>
                        {!correctLogin? <div className="warning"><p>Incorrect input Email/Password. Please try again.</p></div> : null}
                    </div>
                </form>
            </div>
        </>
    );

}

export default Login


