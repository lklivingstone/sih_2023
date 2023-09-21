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
import axios from 'axios';

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
            "content": "This is the second text"
        }
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


    const renderMessages = (messages) => {
        return (
          <ul style={{width: "100%"}}>
            {messages.map(message => (
                <li
                className={message.author === username ? 'right' : 'left'} 
                style={{display: "flex",
                marginBottom: "15px",
                listStyleType: "none",
                justifyContent: message.author === username ? "flex-end" : 'flex-start'
                }}
                key={message.id}>
                        
                    <Paper variant="outlined" 
                    style={{padding: "5px 30px", fontWeight: "600"}}
                    sx={{backgroundColor: "#172a46", border: "1px solid #64ffdb", color: "white"}}
                    >
                        {message.content}
                    </Paper>
                        {/* </p>
                    </div> */}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        );
      };

  
    const handleSendMessageClick = async (event) => {
        if (messageInput.length==0 && !image) {
            return;
        }
        event.preventDefault()
        const formData = new FormData();
        formData.append('document', image);
        
        try {
            const config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            };
            
            const response = await axios.post('http://127.0.0.1:7000/api/prompt/test/', formData, config);
            // console.log("Clicked")
        } catch (error) {
            console.log(error)

            setImage(null)
        }

        
        setMessageValue('')
        setMessageInput('');
    };

    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            handleSendMessageClick(e)
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
            onClick={(e)=>handleSendMessageClick(e)}
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

    const messagingField= (
      <>
        <Paper
          elevation={0} 
          variant="outlined" square
          component="form"
        sx={{border: "2", borderColor: '#64ffdb', backgroundColor: "#031d3b", borderRadius: "250px",  display: 'flex', alignItems: 'center', justifyContent: "center", width: "25%" }}
        // sx={{borderColor: 'green', border: "1", backgroundColor: "transparent", borderRadius: "250px",  display: 'flex', alignItems: 'center', width: "100%" }}
      
      >
                <input
                type="file"
                // style={{ display: 'none' }}
                style={{ width: "150px"}}
                ref={fileInputRef}
                onChange={(e)=>handleFileInputChange(e)}
                />
                    <button 
                    className="upload-icon" 
                    onClick={handleButtonClick}>
                        {
                        !image ? <FileUploadOutlinedIcon fontSize="large"  /> : 
                        <CloudDoneOutlinedIcon fontSize="large" /> 
                        }
                    </button>
        
      </Paper>
        <Paper
            elevation={0} 
            variant="outlined" square
            component="form"
            sx={{border: "2", borderColor: '#64ffdb', backgroundColor: "#031d3b", borderRadius: "250px",  display: 'flex', alignItems: 'center', justifyContent: "center", width: "75%" }}
            // sx={{borderColor: 'green', border: "1", backgroundColor: "transparent", borderRadius: "250px",  display: 'flex', alignItems: 'center', width: "100%" }}
        
        >
            <InputBase
            sx={{ ml: 1, flex: 1, variant:"outlined", color: "white", paddingLeft: "10px"}}
            placeholder="type..."
            value={messageValue}
            onChange={(e)=>hangleMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <IconButton type="button" sx={{ color: "#2c527d" }} aria-label="search">
                <SendOutlinedIcon onClick={(e)=>handleSendMessageClick(e)}/>
            </IconButton>
            
        </Paper>
      </>

  )
    
    return (
        <div style={{
          height: "100vh", 
          width: "100%",
          paddingTop: "70px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a192f"
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
              height: "60px",
              // position: "fixed",
              // bottom: '0',
              display:"flex",
              alignItems: "center",
              backgroundColor: "#0a192f"
            }}>
              {/* {messageInputField}
              {sendMessageButton} */}
              {messagingField}
            </div>
        </div>
    );
  }

export default Promptbox