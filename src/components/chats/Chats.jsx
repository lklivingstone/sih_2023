import { useState, useEffect } from 'react';
import { redirect, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    const user_id= useSelector((state)=>state.user.user_id)
    console.log(user_id)
    // const username= user.user.username
    const username= "creed"
    const navigate = useNavigate();

    const location= useLocation();
    const chat_id= location.pathname.split("/")[2];

    // const token= user.token
    // 123, 123, 'ghi', 'abc', 'def', 'ghi', 'abc', 'def', 'ghi', 'abc', 'def', 'ghi', 
    const [chats, setChats]= useState([
    ])
    console.log(chats)
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

    const addChatsCallback = (chat) => {
        setChats((prevChat) => [ chat, ...prevChat ]);
    };

    const handleRedirectClick = (link) => {
        if (link !== chat_id) {
            navigate(`/c/${link}`)
        } 
    }

    
    const handleHomeRedirectClick = (link) => {
        navigate(`/`)
    }

    useEffect(() => {

        const getChatsFunction = async () => {

            try {
                console.log(user_id)
                    const response = await axios.get(`http://127.0.0.1:7000/api/chats/by-user-id/?user-id=${user_id}`);
                    console.log(response.data)
                    const responseData = response.data
                    responseData.forEach((item) => {

                        console.log(item)
                        addChatsCallback({
                            "id": item['chat_id'],
                            "name": item['name'],
                        })
                    })
                
            }
            catch (err) {
    
            }
        }
        getChatsFunction()
    }, []);
    

    const renderChats = (chats) => {
        return (
            <ul>
                {chats.length>0 && chats?.map(chat => (
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
                                <button 
                                    style={{
                                        backgroundColor: chat.id === chat_id ? '#bbd7ff' : '#8DBCFF',
                                    }}
                                    onClick={() => 
                                        handleRedirectClick(chat.id)
                                    }
                                    className='each-chat-button'
                                    // disabled={chat.id === chat_id}

                                >
                                    {chat.name}
                                </button>
                        </li>
                ))}
            </ul>
        );
    };

    const redirectToLogout = () => {
        navigate("/logout");
    };


    return (
        <div className='chats-container'>
            <div className="chats">
                <div style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <button 
                    style={{    
                        cursor: "pointer"
                    }}
                    onClick={() => handleHomeRedirectClick()}
                    className='new-chat-button'>
                        New Chat <AddIcon />
                    </button>
                </div>
                <div className='each-chat-div' style={{
                    flex: 10,
                    
                    overflowX: "hidden",
                }}>
                    <h3
                        style={{
                            margin: "5%",
                            color: "#DEDEDE"
                        }}
                    >Summarization:</h3>
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
                            backgroundColor: "#8DBCFF",
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
                            color: "#8DBCFF",
                            fontSize: "35px"
                        }} />
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Chats