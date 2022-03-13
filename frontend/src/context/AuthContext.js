import React, { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const AuthContext = React.createContext({
    isLoggedIn: null,
    adminLink: [],
    studentLink: [],
    supervisorLink: [],
    onLogin: () => {},
    onLogout: () => {},
});

export const AuthContextProvider = (props) => {

    const MySwal = withReactContent(Swal)
    const [isLoggedIn, setIsLoggedIn] = useState({state: (localStorage.getItem("token") != null) , role: localStorage.getItem("role")});

    const loginHandler = (token, role) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        setIsLoggedIn({state: true, role: role})
    }

    const logoutHandler = () => {
        MySwal.fire({
            title: <p>Logout Success</p>,
            icon: 'success',
            confirmButtonColor: '#3085d6',
          })
          .then(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            setIsLoggedIn({state: false, role: ""})
            return
          })
    };

    const adminLink = ["", "/CreateUsers","/PeerReview", "/Recommendation"]
    const studentLink = ["", "/Recommendation","/FYPTopics", "/PeerReview"]
    const supervisorLink = ["", "/FYPTopics", "/Groups", "/PeerReview"]

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                onLogin: loginHandler,
                onLogout: logoutHandler,
                adminLink: adminLink,
                studentLink: studentLink,
                supervisorLink: supervisorLink,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
