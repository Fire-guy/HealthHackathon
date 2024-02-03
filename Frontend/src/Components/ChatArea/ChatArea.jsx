import React, {useEffect, useRef} from "react";
import './ChatArea.css';
import { RiSendPlaneFill } from "react-icons/ri";
import { FaMicrophone } from "react-icons/fa6";

const ChatArea = ({ messages, inputMessage, onInputChange, onSendMessage }) => {

    const chatContainerRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    },[]);
    
    const scrollToBottom = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    return (
        <div className="react-chat-area">
            <div className="messages" ref={chatContainerRef} >
                {messages.map((message, index) => (
                    <div key={index} className={message.type}>
                        <span>{message.text}</span>
                    </div>
                ))}
                <div key={1} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={2} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
                <div key={3} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={4} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
                <div key={5} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={6} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
                <div key={7} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={8} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
                <div key={9} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={10} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
                <div key={11} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={12} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
                <div key={13} className="bot">
                    <span>Hello, SymptoCare here to help you.....</span>
                </div>
                <div key={14} className="user">
                    <span>Hello, I am Dhruv Rastogi</span>
                </div>
            </div>
            <div className="input-container">
                <textarea type="text" value={inputMessage} onChange={onInputChange} />
                <span onClick={onSendMessage}>
                    <RiSendPlaneFill />
                </span>
                <span onClick={onSendMessage}>
                    <FaMicrophone />
                </span>
            </div>
        </div>
    )
}

export default ChatArea;