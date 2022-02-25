import React, { useContext } from 'react'
import AuthContext from '../../../context/AuthContext'

function AdminIndex() {

    const context = useContext(AuthContext)

    return (
        <div>
            I am Admin
        </div>
    )
}

export default AdminIndex
