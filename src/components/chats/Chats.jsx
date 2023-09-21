import { useState, useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import axios from 'axios';
// import { fetchChats } from "../Redux/apiCalls";
// import { useDispatch } from "react-redux";
// import { changeChatID, changeRecipient } from "../Redux/userRedux"
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import './Chats.css'

const Chats = () => {
    // const user= useSelector((state)=>state.user)
    // const username= user.user.username
    const username= "creed"
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
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            width: "100%",
                            listStyleType: "none"}}
                            key={chat.id}
                            >
                                <div
                                onClick={(e)=>handleClick(chat)}
                                className='each-chat-div'>
                                    <p
                                        style={{paddingLeft: "10px",
                                        color: "white"}}
                                    >
                                        {chat.desc}
                                    </p>
                                </div>
                                <div className="divider"></div>
                        </li>
                    // </Link>
                ))}
            </ul>
        );
    };

    return (
        <div className="chats">
            <div style={{
                flex: 1
            }}>

            </div>
            <div style={{
                flex: 5
            }}>
                <h3>My Chats</h3>
            {
                renderChats(chats)
            }
            <h3>
                Documents
            </h3>
            {
                renderChats(chats)
            }
            </div>
            <div style={{
                flex: 2
            }}>

            </div>
        </div>
    )
}

export default Chats