import { useState, useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import axios from 'axios';
// import { fetchChats } from "../Redux/apiCalls";
// import { useDispatch } from "react-redux";
// import { changeChatID, changeRecipient } from "../Redux/userRedux"
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import AddIcon from '@mui/icons-material/Add';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import './Chats.css'
import "../customScrollbar/CustomScrollbar.css";

const Chats = () => {
    // const user= useSelector((state)=>state.user)
    // const username= user.user.username
    const username= "creed"
    const navigate = useNavigate();

    // const token= user.token
    // 123, 123, 'ghi', 'abc', 'def', 'ghi', 'abc', 'def', 'ghi', 'abc', 'def', 'ghi', 
    const [chats, setChats]= useState([
        {
            'id': 1,
            'desc': "Lorem Ipsum"
        },
        {
            'id': 2,
            'desc': "Lorem Ipsum"
        },
        {
            'id': 3,
            'desc': "Lorem Ipsum"
        },
        {
            'id': 1,
            'desc': "Lorem Ipsum"
        },
        {
            'id': 2,
            'desc': "Lorem Ipsum"
        },
        {
            'id': 3,
            'desc': "Lorem Ipsum"
        }
    ])
    // const dispatch= useDispatch()
    // const navigate= useNavigate()

    const handleClick = (e) => {
        // console.log(e)
        // dispatch(changeChatID(e.id))
        // const recipient= e.participants[0] === username ? e.participants[1] : e.participants[0] 
        // dispatch(changeRecipient(recipient))
        // navigate(`/chat/${e.id}`)
    }


    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await fetchChats(token, username)
    //         setChats(response)
    //         // console.log(response)
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     };
    
    //     fetchData();
    // }, []);
    

    const renderChats = (chats) => {
        return (
            <ul>
                {chats.length>0 && chats?.map(chat => (
                    // <Link to={`/chat/${chat.id}`}
                    // onClick={handleClick(chat.id)}
                    //         style={{
                    //         textDecoration: 'none',
                    //         color: 'black'
                    //     }}
                    // >
                        <li
                            className='each-chat-li'
                            style={{display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            listStyleType: "none"}}
                            key={chat.id}
                            >
                                {/* <div
                                onClick={(e)=>handleClick(chat)}
                                className='each-chat-div'>
                                    <p
                                        style={{paddingLeft: "10px",
                                        color: "white"}}
                                    >
                                        {chat.desc}
                                    </p>
                                </div> */}
                                <button className='each-chat-button'>
                                    test
                                </button>
                        </li>
                    // </Link>
                ))}
            </ul>
        );
    };

    const redirectToLogout = () => {
        navigate("/logout");
    };


    return (
        <div className="chats">
            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <button className='new-chat-button'>
                    New Chat <AddIcon />
                </button>
            </div>
            <div className='each-chat-div' style={{
                flex: 4,
                
                overflowX: "hidden",
            }}>
                <h3
                    style={{
                        margin: "5%",
                        color: "#D2B7E5"
                    }}
                >My Chats</h3>
            {
                renderChats(chats)
            }
            </div>
            <div 
            className='custom-scrollbar'
            style={{
                flex: 4,
                overflow: "scroll"
            }}>
            <h3
                style={{
                    margin: "5%",
                    color: "#D2B7E5"
                }}>
                Documents
            </h3>
            {
                renderChats(chats)
            }
            </div>
            <div style={{
                flex: 3,
                display: "flex"
            }}>
                <div style={{
                    // backgroundColor: "white",
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div
                    style={{
                        height: "70%",
                        width: "70%",
                        backgroundColor: "#C6A4DE",
                        padding: "8%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "15px",
                        boxShadow: "inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.5)"

                    }}>
                        <p>System Monitoring</p>
                        <button className='monitor-button'>
                            Monitor
                        </button>

                    </div>
                </div>
                <div style={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around"
                }}>
                    {/* <div > */}
                        <button
                        onClick={redirectToLogout}
                        style={{
                            font: "Poppins",
                            height: "30px",
                            width: "30px",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer"
                        }}
                        >
                            J
                        </button>
                        {/* <h2>J</h2> */}
                    {/* </div> */}
                    <FirstPageIcon style={{
                        color: "rgb(253, 208, 255)",
                        fontSize: "35px"
                    }} />
                </div>

            </div>
        </div>
    )
}

export default Chats