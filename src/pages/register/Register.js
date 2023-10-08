import { Button, CssBaseline } from "@mui/material"
import { styled } from "@mui/system"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../api/RequestMethods";

import { Link } from "react-router-dom";

import "./Register.css"



const Register = () => {

    const [username, setUsername]= useState("")
    const [password, setPassword]= useState("")
    const [confirmPassword, setConfirmPassword]= useState("")
    const [firstname, setFirstname]= useState("")
    const [lastname, setLastname]= useState("")
    const [email, setEmail]= useState("")
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const [loading, setLoading] = useState(false)
    const [warning, setWarning]= useState("")

    const navigate= useNavigate()

    
    const dispatch= useDispatch()
    // const { isFetching, error }= useSelector(state=>state.user)

    // const { isFetching, error }= useSelector(state=>state.user)

    const handleClick = async (e) => {
        e.preventDefault()
        // console.log(firstname, lastname, email, username, password)

        if (password!==confirmPassword) {
            setPasswordMismatch(true)
        }
        else {
            const response= await register({ first_name : firstname, last_name : lastname, username : username, email : email , password : password })
            console.log(response)
            if (response.status===201) {
                navigate("/login")
            }
            else {
                const { username, email } = response['message'];
                console.log(username, email)
                if (username && email){
                    setWarning("Username and Email already in use!")
                }
                else if (email) {
                    setWarning("Email already in use!")
                }
                else if (username){
                    setWarning("Username already in use!")
                }
                else {
                    setWarning("Invalid Credentials!")
                }
                alert(warning)
            }
        }
    }
    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            handleClick(e)
        }
    };
    return (
        <div style={{
            backgroundColor: "#D2B7E5",
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color:"rgb(48, 48, 48)",}}>
            <div style={{
                width: "50%",
                padding: "20px",
                borderRadius: "7px",
                border: "1px solid rgb(48, 48, 48)"}}>
                <h1 style={{
                    margin: "10px 10px",
                    fontWeight: "200",}}>
                    CREATE AN ACCOUNT
                </h1>
                <form className="register-container">
                    <input style={{
                            flex: "1",
                            minWidth: "40%",
                            margin: "10px 10px",
                            padding: "10px"}} placeholder="First Name" onChange={(e)=>setFirstname(e.target.value)}/>
                    <input style={{
                        flex: "1",
                        minWidth: "40%",
                        margin: "10px 10px",
                        padding: "10px"}} placeholder="Last Name" onChange={(e)=>setLastname(e.target.value)}/>
                    <input style={{
                        flex: "1",
                        minWidth: "40%",
                        margin: "10px 10px",
                        padding: "10px"}} placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
                    <input style={{
                        flex: "1",
                        minWidth: "40%",
                        margin: "10px 10px",
                        padding: "10px"}} placeholder="E-Mail" onChange={(e)=>setEmail(e.target.value)}/>
                    <input 
                        type="password" 
                        className={passwordMismatch ? 'mismatch' : ''}
                        style={{
                            flex: "1",
                            minWidth: "40%",
                            margin: "10px 10px",
                            padding: "10px"}} 
                        placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                    <input 
                    type="password" 
                    className={passwordMismatch ? 'mismatch' : ''}
                    style={{
                        flex: "1",
                        minWidth: "40%",
                        margin: "10px 10px",
                        padding: "10px"}} placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown}/>
                    <span style={{
                        fontSize: "12px",
                        margin: "10px 10px"}}>
                        By creating an account <b>PRIVACY POLICY</b>
                    </span>
                </form>
                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}} >
                    <div style={{
                        display:"flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "10px 0px 0px 0px"}}>
                            <button style={{
                            padding: "10px 65px",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: 'Poppins',
                            backgroundColor: "rgb(48, 48, 48)",
                            color: "#edf5e1",
                            "&:disabled" : {
                                color: "#e1e6f5",
                                cursor: "not-allowed"
                            }}} variant="filled" onClick={handleClick} >
                                REGISTER
                        </button>
                        {/* <button style={{
                            padding: "10px 65px",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: 'Reem Kufi Fun',
                            backgroundColor: "rgb(48, 48, 48)",
                            color: "#edf5e1",
                            "&:disabled" : {
                                color: "#e1e6f5",
                                cursor: "not-allowed"
                            }}} variant="filled" onClick={handleClick} disabled={isFetching}>
                                REGISTER
                        </button> */}
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Register