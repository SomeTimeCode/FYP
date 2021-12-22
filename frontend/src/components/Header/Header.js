import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import './Header.css'

function Header(props) {

    const ctx = useContext(AuthContext)

    


    return (
        <div id='HeaderBase'>
            Welcome back {props.role}
            <button onClick={(e) => {ctx.onLogout()}}>test</button>
        </div>
    )
}

export default Header
