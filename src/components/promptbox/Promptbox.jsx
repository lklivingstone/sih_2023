import './Promptbox.css';
import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import SendButton from '../sendButton/SendButton';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Paper, InputBase  } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import ChatInput from '../chatInput/ChatInput';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

const { reverse } = Array;

const Promptbox = ({name}) => {
    // const ID= useSelector((state)=>state.user.chatID)
    const ID= 1;
    // const recipient= useSelector((state)=>state.user.recipient)
    const [messageInput, setMessageInput] = useState('');
    const [messageValue, setMessageValue]= useState('');
    
    // const username = useSelector((state) => state.user.user.username);
    const username = "creed";
    const [messages, setMessages] = useState([
        {
            "id": 1,
            "author": "creed",
            "content": "This is the first text"

        },
        {
            "id": 2,
            "author": "llm",
            "content": "This is the second text",
            "current": "",
            "english": "",
            "hindi": "",
        },
        
    ]);
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView()
    }

    // useEffect(() => {
    //     const waitForSocketConnection = (callback) => {
    //     setTimeout(() => {
    //         if (WebSocketInstance.state() === 1) {
    //         console.log("Connection is secure");
    //         if (callback != null) {
    //             callback();
    //         }
    //         return;
    //         } else {
    //         console.log("Waiting for connection...");
    //         waitForSocketConnection(callback);
    //         }
    //     }, 100);
    //     };

    //     WebSocketInstance.addCallbacks(setMessagesCallback, addMessageCallback);
    //     waitForSocketConnection(() => {
    //         WebSocketInstance.fetchMessages(username, ID);
    //     });
    //     WebSocketInstance.connect(ID)
    // }, [ID]);

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const setMessagesCallback = (newMessages) => {
        setMessages((prevMessages) => [...newMessages.reverse()]);
    };

    const addMessageCallback = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const changeLanguage = ({e, message}) => {
        e.preventDefault()

        
    }


    const renderMessages = (messages) => {
        return (
          <ul style={{width: "100%"}}>
            {messages.map(message => (
                <li
                className={message.author === username ? 'right' : 'left'} 
                style={{
                    display: "flex",
                marginBottom: "15px",
                listStyleType: "none",
                justifyContent: message.author === username ? "flex-end" : 'flex-start'
                }}
                key={message.id}>
                    {message.author === username ? (
                        <Paper
                        variant="outlined"
                        style={{ padding: "5px 30px", fontWeight: "600" }}
                        sx={{ backgroundColor: "#E4CEFF", color: "#303030" }}
                        >
                        <p>{message.content}</p>
                        </Paper>
                    ) : (
                        <Paper
                        variant="outlined"
                        style={{ padding: "5px 30px", fontWeight: "600", position: "relative" }}
                        sx={{ backgroundColor: "#FFCEF1", color: "#303030" }}
                        >
                        <p>{message.content}</p>
                        <button
                            onClick={({e, message})=>changeLanguage({e, message})}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px"
                            }}
                        >
                            Change Language
                        </button>
                        </Paper>
                    )}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        );
      };

    const [ query, setQuery ] = useState("")
  
    const handleQuerySubmit = async (event) => {
        event.preventDefault()
        if (query.length==0 && !image) {
            return;
        }

        if (image) {
            const formData = new FormData();
            formData.append('document', image);
            
            try {
                const config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                };
                
                const response = await axios.post('http://127.0.0.1:7000/api/prompt/upload-document/', formData, config);
                
                // {
                //     "id": 1,
                //     "author": "creed",
                //     "content": "This is the first text"
                // }
                
                // console.log(response)
                console.log(response["data"])
    
    
                addMessageCallback({
                    "id": response["data"]["qid"],
                    "author": "creed",
                    "content": response["data"]["question"],
                })
                
                addMessageCallback({
                    "id": response["data"]["aid"],
                    "author": "llm",
                    "content": response["data"]["english"] + "\n \n" + response["data"]["hindi"],
                })
    
                setImage(null)
    
                // console.log("Clicked")
            } catch (error) {
                console.log(error)
    
                setImage(null)
            }
        }
        else {

            console.log("clcked")
            // const formData = new FormData();
            // formData.append('document', image);
            
            try {
                const config = {
                    prompt: query
                };
                
                const response = await axios.post('http://127.0.0.1:7000/api/prompt/summarize/', config);
                
                // {
                //     "id": 1,
                //     "author": "creed",
                //     "content": "This is the first text"
                // }
                
                // console.log(response)

                console.log(response["data"])
    
                addMessageCallback({
                    "id": response["data"]["qid"],
                    "author": "creed",
                    "content": response["data"]["question"],
                })
                
                addMessageCallback({
                    "id": response["data"]["aid"],
                    "author": "llm",
                    "content": response["data"]["english"] + "\n \n" + response["data"]["hindi"],
                })
    
                setImage(null)
    
                // console.log("Clicked")
            } catch (error) {
                console.log(error)
    
                setImage(null)
            }
        }

        
        setMessageValue('')
        setMessageInput('');
    };

    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            // handleSendMessageClick(e)
        }
      };
  

    const hangleMessageInput= (data) => {
      setMessageValue(data)
      setMessageInput(data)
      // console.log(messageValue, messageInput)
    }
  
    const messageInputField = (
        <input
            id="chat-message-input"
            type="text"
            size="100px"
            placeholder="Type..."
            value={messageValue}
            onChange={(e)=>hangleMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
  
    const sendMessageButton = (
        <input
            id="chat-message-submit"
            type="button"
            value="Send"
            // onClick={(e)=>handleSendMessageClick(e)}
        />
    );

    
    const fileInputRef = useRef(null);

    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        console.log("file")
        const file = event.target.files[0];
        // Handle the selected file here
        setImage(file)
    };
    console.log(image)

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const textareaClass = isFocused ? 'focused-textarea' : 'normal-textarea';


    // console.log(query)

    const messagingField= (
      <>
        <input
                type="file"
                style={{ display: 'none' }}
                // style={{ width: "150px"}}
                ref={fileInputRef}
                onChange={(e)=>handleFileInputChange(e)}
                />
                    <button 
                    className="upload-icon" 
                    onClick={handleButtonClick}>
                        Upload PDF
                        {
                        !image ? <FileUploadOutlinedIcon fontSize="large"  /> : 
                        <CloudDoneOutlinedIcon fontSize="large" /> 
                        }
                    </button>
                    <div style={{
                        width: "80%",
                        padding: 0,
                        margin: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        backgroundColor: "#303030",
                        position: "relative"
                    }}>
                        <textarea
                            onChange={(e)=>setQuery(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={textareaClass}
                            placeholder="Type your query..."
                        />
                        <SendRoundedIcon 
                            onClick={(e)=>handleQuerySubmit(e)}
                            style={{
                                zIndex: 10000,
                            position: "absolute",
                            right: "5px",
                            color: "white",
                            bottom: "13px"

                        }} /> 
                    </div>
      </>

  )



    
    return (
        <div style={{
          height: "100vh", 
          width: "100%",
          paddingTop: "70px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#D2B7E5",
          position: "relative"
        }}>
            
            <div
                style={{
                    padding: "20px",
                    flex: 1, 
                    width: "100%",
                    display: "flex",
                    overflowY: "auto"
                }}
            >
                {renderMessages(messages)}
            </div>
            <div style={{
              height: "280px",
              width: "100%",
              // position: "fixed",
              // bottom: '0',
                        display: "flex",
                        alignItems: "flex-end",
                        // justifyContent: "center",
            //   backgroundColor: "#D2B7E5",
              position: "absolute",
              bottom: "0",
            //   zIndex: "-1"
            }}>
              {/* {messageInputField}
              {sendMessageButton} */}
              {messagingField}
            </div>
        </div>
    );
  }

export default Promptbox