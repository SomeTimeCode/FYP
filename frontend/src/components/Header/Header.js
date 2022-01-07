import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import { MdOutlinePerson, MdLogout } from "react-icons/md";
import './Header.css'

function Header(props) {

    const ctx = useContext(AuthContext)

    return (
        <div id='HeaderBase'>
            <div className="Left">
                <h1>FYP Management System</h1>
            </div>
            <div className="Right">
                <p><MdOutlinePerson/>&nbsp;{props.role.toUpperCase()}</p>
                <button onClick={(e) => {ctx.onLogout()}}><p><MdLogout size={18}/>&nbsp;&nbsp;</p><p>Logout</p></button>
            </div>
        </div>
    )
}

export default Header
