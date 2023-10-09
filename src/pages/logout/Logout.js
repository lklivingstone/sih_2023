import { logOut } from "../../redux/UserRedux";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useState } from "react";

import { Link } from "react-router-dom";




const Logout = () => {


    const dispatch= useDispatch()
    const navigate= useNavigate()

    const handleClick = (e) => {
        dispatch(logOut())

        navigate("/")
    }

    return (
        <div 
        style={{width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color:"rgb(48, 48, 48)"}}>
            <div style={{
                width: "50%",
                padding: "20px",
                borderRadius: "7px",
                border: "1px solid rgb(48, 48, 48)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"}}>
                <h1 style={{
                    margin: "10px 10px",
                    fontWeight: "200",}}>
                    Do you want to logout? 
                </h1>
                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}} >
                    <div style={{
                        display:"flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "10px 0px 0px 0px"}}>
                        <button style={{
                            padding: "10px 65px",
                            color: "#edf5e1",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: 'Poppins',
                            backgroundColor: "rgb(48, 48, 48)",
                            "&:disabled" : {
                                color: "#e1e6f5",
                                cursor: "not-allowed"
                            }}} variant="filled" onClick={handleClick} >
                                <p>LOGOUT</p>
                        </button>
                    </div>
                
                </div>
            </div>
        </div>
                    
    )
}

export default Logout
