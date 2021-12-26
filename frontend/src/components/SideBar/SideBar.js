import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import "./SideBar.css"

function Cards(props){

    const navigate = useNavigate()

    return(
        props.link === "" ? 
            <div className='SiderCard' onClick={(e) => {navigate(`/${props.role}${props.link}`)}}>
                <p>Index</p>
            </div>
        :   
            <div className='SiderCard' onClick={(e) => {navigate(`/${props.role}${props.link}`)}}>
                <p>{props.link.substring(1)}</p>
            </div>
    )
}

function SideBar(props) {

    const ctx = useContext(AuthContext)

    const link = (props.role === "admin" ? ctx.adminLink : (props.role === "student" ? ctx.studentLink : ctx.supervisorLink))

    return (
        <div id='SiderBase'>
            {link.map((link) => {
                return <Cards key={link} link={link} role={props.role}/>
            })}
        </div>
    )
}


export default SideBar
