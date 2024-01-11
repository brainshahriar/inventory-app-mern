import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getLoginStatus } from "../services/authService"
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom"
import { SET_LOGIN } from "../redux/features/auth/authSlice"

const useRedirectLoggedOutUser  = (path) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        const redirectLoggedOutUser = async() =>{
            const isLoggedIn = await getLoginStatus();
            dispatch(SET_LOGIN(isLoggedIn))

            if(!isLoggedIn) {
                toast.info('Session expired, please log in again')
                navigate(path)
                return
            }
        }
        redirectLoggedOutUser()
    },[navigate,path,dispatch])
}

export default useRedirectLoggedOutUser