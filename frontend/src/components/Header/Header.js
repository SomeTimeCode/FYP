import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import './Header.css'

function Header(props) {

    const ctx = useContext(AuthContext)


    return (
        <div id='HeaderBase'>
            <div className="Left">
                <h1>FYP Management System</h1>
            </div>
            <div className="Right">
                {props.role}
                <button onClick={(e) => {ctx.onLogout()}}>Logout</button>
            </div>
        </div>
    )
}

export default Header
