import './Promptbox.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import { Wobble } from '@uiball/loaders'


const { reverse } = Array;

const Promptbox = ({name}) => {
    // const ID = useSelector((state)=>state.user.chatID)
    const ID = 1;
    const location= useLocation();
    const chat_id= location.pathname.split("/")[2];
    console.log(chat_id)
    // const recipient = useSelector((state)=>state.user.recipient)
    const [messageInput, setMessageInput] = useState('');
    const [messageValue, setMessageValue]= useState('');
    const [tempMessage, setTempMessage]= useState('');
    
    // const username = useSelector((state) => state.user.user.username);
    const username = "creed";
    const [messages, setMessages] = useState([
        // {
        //     "id": 1,
        //     "author": "creed",
        //     "content": "This is the first text"

        // },
        // {
        //     "id": 2,
        //     "author": "llm",
        //     "currIndex" : 0,
        //     "totalLangs" : 2,
        //     'langs' : ['English', 'Hindi'],
        //     "content": {
        //         'English' : "This is second text",
        //         'Hindi' : "Hindi This is second text"
        //     }
        // },

    ]);
    const messagesEndRef = useRef(null)
    const addMessageCallback = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };
    
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView()
    }

    useEffect(() => {

        const getChatsFunction = async () => {

            try {
                if (chat_id) {
    
                    const response = await axios.get(`http://127.0.0.1:7000/api/chats/by-chat-id/?chat_id=${chat_id}`);
                    console.log(response.data)
                    const responseData = response.data
                    responseData.forEach((item) => {
                        console.log(item)
                        // const string = "['English', 'Hindi']";
        
                        // Create a regular expression to match the English and Hindi languages.
                        item['langs'] = item['langs'].slice(1, -1);
                        const regex = /'([^']+)'/g;
                        const matches = [];
        
                        let match;
                        while ((match = regex.exec(item['langs'])) !== null) {
                        matches.push(match[1]);
                        }
        
                        item['langs'] = matches
        
                        if (item['prompt'].substring(0, 9) === '***DOC***') {
                            addMessageCallback({
                                "id": item['chat_id']+"u",
                                "author": "creed",
                                "content": "DOC",
                            })
                        }
                        else {
                            addMessageCallback({
                                "id": item['chat_id']+"u",
                                "author": "creed",
                                "content": item['prompt'],
                            })
                        }
                        
                        addMessageCallback({
                            "id": item['chat_id']+"m",
                            "author": "llm",
                            "currIndex" : 0,
                            "totalLangs" : item['langs'].length,
                            'langs' : item['langs'],
                            'timestamp' : item['timestamp'],
                            "content": item['ans']
                        })
                    })
                }
            }
            catch (err) {
    
            }
        }
        getChatsFunction()
    }, []);

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const setMessagesCallback = (newMessages) => {
        setMessages((prevMessages) => [...newMessages.reverse()]);
    };


    const changeLanguage = ({e, message}) => {
        e.preventDefault()

        
    }

    const handleArrowLeftClick = (message, index) => {
        // Get the current value of currIndex.
        const currentCurrIndex = message.currIndex;
      
        // Reduce the value of currIndex by 1.
        const newCurrIndex = currentCurrIndex - 1;
      
        // If the newCurrIndex is less than 0, set it to the total number of languages - 1.
        const finalCurrIndex = newCurrIndex < 0 ? message.totalLangs - 1 : newCurrIndex;
      
        // Update the currIndex of the message.
        const updatedMessage = { ...message, currIndex: finalCurrIndex };
      
        // Set the updated message in the messages state.
        setMessages((messages) => {
          const newMessages = [...messages];
          newMessages[index] = updatedMessage;
          return newMessages;
        });
    };

    const handleArrowRightClick = (message, index) => {
        // Get the current value of currIndex.
        const currentCurrIndex = message.currIndex;
      
        // Reduce the value of currIndex by 1.
        const newCurrIndex = currentCurrIndex + 1;
      
        // If the newCurrIndex is less than 0, set it to the total number of languages - 1.
        const finalCurrIndex = newCurrIndex === message.totalLangs ? 0 : newCurrIndex;
      
        // Update the currIndex of the message.
        const updatedMessage = { ...message, currIndex: finalCurrIndex };
      
        // Set the updated message in the messages state.
        setMessages((messages) => {
          const newMessages = [...messages];
          newMessages[index] = updatedMessage;
          return newMessages;
        });
    };

      
    const renderMessages = (messages) => {
        return (
          <ul style={{width: "100%"}}>
            {messages?.map((message, index) => (
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
                        style={{ padding: "5px 30px", fontWeight: "600"}}
                        sx={{ backgroundColor: "#E4CEFF", color: "#303030" }}
                        >
                            <p>{message.content}</p>
                        </Paper>
                    ) : (
                        <Paper
                        variant="outlined"
                        style={{ padding: "5px 30px", fontWeight: "600", position: "relative", paddingBottom: "50px"  }}
                        sx={{ backgroundColor: "#FFCEF1", color: "#303030" }}
                        >
                        <p>{message.content[message.langs[message.currIndex]]}</p>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "15px",
                                right: "15px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        
                        >
                            <ArrowLeftOutlinedIcon style={{
                                fontSize: "40px"
                            }} 
                            onClick={(e)=>handleArrowLeftClick(message, index)}
                            />
                            <p
                            >
                                {message.langs[message.currIndex]}
                            </p>
                            <ArrowRightOutlinedIcon style={{
                                fontSize: "40px"
                            }} 
                            onClick={(e)=>handleArrowRightClick(message, index)}
                            />
                        </div>
                        </Paper>
                    )}
              </li>
            ))}
            {
                tempMessage !== '' &&
                <>
                <li
                    className='left' 
                    style={{
                        display: "flex",
                    marginBottom: "15px",
                    listStyleType: "none",
                    justifyContent: "flex-end"
                    }}
                    key={1000}>
                            <Paper
                            variant="outlined"
                            style={{ padding: "5px 30px", fontWeight: "600"}}
                            sx={{ backgroundColor: "#E4CEFF", color: "#303030" }}
                            >
                            <p>{tempMessage}</p>

                            </Paper>
                </li>
                <li
                className='right' 
                style={{
                    display: "flex",
                    marginBottom: "15px",
                    listStyleType: "none",
                    justifyContent: 'flex-start'
                }}
                key={1001}
                >
                    <Paper
                        variant="outlined"
                        style={{ padding: "5px 30px", fontWeight: "600", paddingBottom: "50px"  }}
                        sx={{ backgroundColor: "#FFCEF1", color: "#303030" }}
                        >
                        <Wobble size = {45} color = 'black' speed = {0.9}/>
                        
                        </Paper>
                </li>
                </>

            }
            <div ref={messagesEndRef} />
          </ul>
        );
      };

    const [ query, setQuery ] = useState("")

    const navigate = useNavigate();
  
    const handleQuerySubmit = async (event) => {
        event.preventDefault()
        if (query.length==0 && !image) {
            return;
        }

        if (image) {
            const formData = new FormData();
            formData.append('document', image);
            formData.append('user_id', 'e219ade0-1cc0-4b07-804d-f6f10a25dc23');
            if (chat_id) {
                formData.append('chat_id', chat_id);
            }
            else {
                formData.append('chat_id', -1);
            }
            
            try {
                setTempMessage("DOC")
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
                // console.log(response["data"])

                setTempMessage('')

                const response_data = response["data"]["data"]
                
                if (!chat_id) {
                    navigate(`/c/${response_data['chat_id']}`);

                }
                
                // console.log(response_data['prompt'])
                if (response_data['prompt'].substring(0, 9) === '***DOC***') {
                    addMessageCallback({
                        "id": response_data['chat_id']+"u",
                        "author": "creed",
                        "content": "DOC",
                    })
                }
                else {
                    addMessageCallback({
                        "id": response_data['chat_id']+"u",
                        "author": "creed",
                        "content": response_data['prompt'],
                    })
                }
                
                addMessageCallback({
                    "id": response_data['chat_id']+"m",
                    "author": "llm",
                    "currIndex" : 0,
                    "totalLangs" : response_data['langs'].length,
                    'langs' : response_data['langs'],
                    'timestamp' : response_data['timestamp'],
                    "content": response_data['ans']
                })
    
                setImage(null)
    
                // console.log("Clicked")
            } catch (error) {
                console.log(error)
    
                setImage(null)
            }
        }
        else {

            // console.log("clcked")
            const formData = new FormData();
            formData.append('prompt', image);
            formData.append('user_id', 'e219ade0-1cc0-4b07-804d-f6f10a25dc23');
            if (chat_id) {
                formData.append('chat_id', chat_id);
            }
            else {
                formData.append('chat_id', -1);
            }
            
            try {
                setTempMessage(query)
                const config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                };
                
                const response = await axios.post('http://127.0.0.1:7000/api/prompt/summarize/', {
                    "prompt" : query,
                    'user_id' : 'e219ade0-1cc0-4b07-804d-f6f10a25dc23',
                    'chat_id' : chat_id
                });
                
                setTempMessage('')

                const response_data = response["data"]["data"]
                
                if (!chat_id) {
                    navigate(`/c/${response_data['chat_id']}`);

                }
                
                // console.log(response_data['prompt'])
                if (response_data['prompt'].substring(0, 9) === '***DOC***') {
                    addMessageCallback({
                        "id": response_data['chat_id']+"u",
                        "author": "creed",
                        "content": "DOC",
                    })
                }
                else {
                    addMessageCallback({
                        "id": response_data['chat_id']+"u",
                        "author": "creed",
                        "content": response_data['prompt'],
                    })
                }
                
                addMessageCallback({
                    "id": response_data['chat_id']+"m",
                    "author": "llm",
                    "currIndex" : 0,
                    "totalLangs" : response_data['langs'].length,
                    'langs' : response_data['langs'],
                    'timestamp' : response_data['timestamp'],
                    "content": response_data['ans']
                })
    
                setImage(null)
                setQuery("")
    
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
    //   console.log(messageInput)
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
                            bottom: "13px",
                            cursor: "pointer",
                        

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
            {
                (chat_id || tempMessage !== '') &&
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
            }
            {
                (!chat_id && tempMessage === '') &&
                <>
                    <div
                    style= {{
                        // backgroundColor: "white",
                        height: "20%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly"
                    }}
                    >
                        <button
                        style={{
                            fontFamily: 'Poppins',
                            padding: '10px',
                            /* height: 80%; */
                            // margin: 5px;
                            // margin-top: 10px;
                            width: "30%",
                            borderRadius: '5px',
                            backgroundColor: "transparent",
                            border: "2px solid #303030",
                            color: "#303030",
                            fontSize: "medium",
                            display: "flex",
                            justifyContent: "center"
                        }}
                            // className='new-chat-button'
                        >
                            Characteristics Length of Ray ...
                        </button>
                        <button
                        style={{
                            fontFamily: 'Poppins',
                            padding: '10px',
                            /* height: 80%; */
                            // margin: 5px;
                            // margin-top: 10px;
                            width: "30%",
                            borderRadius: '5px',
                            backgroundColor: "transparent",
                            border: "2px solid #303030",
                            color: "#303030",
                            fontSize: "medium",
                            display: "flex",
                            justifyContent: "center"
                        }}
                            // className='new-chat-button'
                        >
                            Busbar in Power Plant purpo ...
                        </button>
                        <button
                        style={{
                            fontFamily: 'Poppins',
                            padding: '10px',
                            /* height: 80%; */
                            // margin: 5px;
                            // margin-top: 10px;
                            width: "30%",
                            borderRadius: '5px',
                            backgroundColor: "transparent",
                            border: "2px solid #303030",
                            color: "#303030",
                            fontSize: "medium",
                            display: "flex",
                            justifyContent: "center"
                        }}
                            // className='new-chat-button'
                        >
                            Coordinator Geometry % Line ...
                        </button>
                    </div>
                    <div
                    style= {{
                        // backgroundColor: "white",
                        height: "60%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    >
                        <h1
                        style={{
                            color: "#303030",
                            fontSize: "6em"
                        }}
                        >SCOTTs GPT</h1>
                    </div>
                </>
            }
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