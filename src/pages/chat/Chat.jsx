import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import Sidepanel from '../../components/sidepanel/Sidepanel';
import Chats from '../../components/chats/Chats';
import Promptbox from '../../components/promptbox/Promptbox';

const Chat = () => {
    // const token= useSelector((state)=>state.user.token)
    // console.log(token)

    
    const location= useLocation();
    const room= location.pathname.split("/")[2];
    // console.log(room)
    const [roomName, setRoomName]= useState("")

    let navigate= useNavigate()

    const redirectRoom= () => {
        navigate(`/room/${roomName}`)
    }

    return (
        <div className="Chat">
            <Sidepanel />
            <Chats />
            <div className='join'>
                <Promptbox  name={"LK"}/>
                {/* <div className='enter'>
                    What chat room would you like to enter? <br/>
                    <input onChange={(event)=>setRoomName(event.target.value)}/><br/>
                    <input  type="button" placeholder='Enter' value="Enter" onClick={redirectRoom}/>
                </div> */}
            </div>
        </div>
    )
}

export default Chat