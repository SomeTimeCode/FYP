import React, {useState, useContext, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

function ProtectedRoute({role}) {
    
    const [render, setRender] = useState({isAuth: false, isLoading: true})
    const ctx = useContext(AuthContext)
    
    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/auth/checkToken/${localStorage.getItem('role')}`, requestOptions)
            .then(async (response) => {
                console.log(response)
                if(response.status === 200){
                    setRender({isAuth: true, isLoading: false})
                }else{
                    setRender({isAuth: false, isLoading: false})
                }
            }).catch((err) => {console.log(err); setRender({isAuth: false, isLoading: false})})
        }
        fetchData()
    }, [])



    return (
        <>  
            {render.isLoading ? 
                <p>isLoading</p>
            :(   
                render.isAuth ?
                    ((ctx.isLoggedIn.state && ctx.isLoggedIn.role.toLowerCase() === role) ?  <Outlet /> : <Navigate to="/" />)
                :   
                    <>  
                        <Navigate to="/" />
                    </>
            )}
        </>
    )
}

export default ProtectedRoute
