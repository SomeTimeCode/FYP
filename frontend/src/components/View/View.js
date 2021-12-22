import React from 'react'
import Header from '../Header/Header'
import SideBar from '../SideBar/SideBar'
import './View.css'



function View(props) {
    return (
        <div id='Page'>
            <div id='Header'>
                <Header role={props.role}/>
            </div>
            <div id='Body'>
                <div id='SideBar'>
                    <SideBar role={props.role}/>
                </div>
                <div id='Content'>
                    {props.element}
                </div>
            </div>
        </div>
    )
}

export default View