import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import "./SideBar.css"

function Cards(props){
    return(
        props.link === "" ? <Link to={`/${props.role}${props.link}`}>Index</Link> : <Link to={`/${props.role}${props.link}`}>{props.link.substring(1)}</Link>
    )
}

function SideBar(props) {

    const ctx = useContext(AuthContext)

    const link = (props.role === "admin" ? ctx.adminLink : (props.role === "student" ? ctx.studentLink : ctx.supervisorLink))

    return (
        <div>
            {link.map((link) => {
                return <Cards link={link} role={props.role}/>
            })}
        </div>
    )
}


export default SideBar
