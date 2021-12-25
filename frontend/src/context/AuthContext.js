import React, { useState } from "react";

const AuthContext = React.createContext({
    isLoggedIn: null,
    adminLink: [],
    studentLink: [],
    supervisorLink: [],
    onLogin: () => {},
    onLogout: () => {},
});

export const AuthContextProvider = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState({state: (localStorage.getItem("token") != null) , role: localStorage.getItem("role")});

    const loginHandler = (token, role) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        setIsLoggedIn({state: true, role: role})
    }

    const logoutHandler = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setIsLoggedIn({state: false, role: ""})
    };

    const adminLink = [""]
    const studentLink = ["", "/StudentFYPTopics"]
    const supervisorLink = ["", "/FYPTopics"]

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
