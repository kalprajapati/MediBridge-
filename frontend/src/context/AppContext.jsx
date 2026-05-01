import { createContext } from "react";
import { doctors } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') ? localStorage.getItem('adminToken') : '')
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const adminBackendUrl = import.meta.env.VITE_ADMIN_BACKEND_URL
    const [userData, setUserData] = useState(false)

    const [isAdmin, setIsAdmin] = useState(false)

    const loadUserData = async () => {
        try {
            const { data } =await axios.get(backendUrl + '/get-profile', { headers: { token } })
            console.log(data.userData)
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    const value = {
        doctors,
        currencySymbol,
        token, setToken,
        adminToken, setAdminToken,
        backendUrl,adminBackendUrl,
        userData, setUserData,
        loadUserData, 
        isAdmin, setIsAdmin
    }
    useEffect(() => {
        if (token) {
            loadUserData()
        } else {
            setUserData(false)
        }
    }, [token])

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}

export default AppContextProvider
