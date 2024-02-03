import React, { useState, useEffect } from 'react';
import { useAPI } from '../Components/context';
import Navbar from "../Components/Navigation/Navbar";
import ChatArea from "../Components/ChatArea/ChatArea";
import './MainPage.css';

const MainPage = () => {

    const { addUserMessage, addUser, addBotMessage, addConversation,
        flag, userId, conversationId, fetchMessages, FLASK_API_URL, getOtp } = useAPI();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [conversationHeaders, setConversationHeaders] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchConversationHeaders = async () => {
            const response = await addConversation();
            if (response.ok) {
                setConversationHeaders(response.conversations);
            } else {
                console.error('Error fetching conversation headers:', response.message);
            }
        };
        
        if(flag === 1){
            fetchConversationHeaders();
        }
    }, [flag,addConversation]);

    const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    };

    const sendMessageToRasa = async () => {
        try {
            const response = await fetch(`${FLASK_API_URL}/webhook`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputMessage }),
            });
            setInputMessage('');
            if (response.ok) {
                setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputMessage }]);
                const responseData = await response.json();
                setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: responseData.message }]);
                return responseData;
            } else {
                console.error('Error sending message to Rasa:', response.status);
                return { success: false, message: 'Error sending message to Rasa' };
            }
        } catch (error) {
            console.error('Error sending message to Rasa:', error);
            return { success: false, message: 'Error sending message to Rasa' };
        }
    };

    const handleSendMessage = async () => {
        if(userId){
            handleSendMessageToDatabase();
        }
        else {
            const data = sendMessageToRasa();
            if(data.flag === 1){
                setName(data.name);
            }
            else if(data.flag === 2){
                setName(data.name);
                setEmail(data.email);
                addUser(name, email);
            }
            else if(data.flag === 0){
                setEmail(data.email);
            }
            else if(data.flag === 15){
                const response = await getOtp(data.otp);
                if(response.ok){
                    const userMessages = messages.filter((message) => message.type === 'user');
                    const botMessages = messages.filter((message) => message.type === 'bot');
                    addConversation(userId, userMessages, botMessages);
                }
            }
        }
    };

    const handleSendMessageToDatabase = async () => {
        const response = await addUserMessage(userId, inputMessage);

        if (response.ok) {
            setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputMessage }]);
            
            const botResponse = 'Hello! How can I help you?';
            await addBotMessage(userId, botResponse);

            setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: botResponse }]);
            
            setInputMessage('');
        } else {
            console.error('Error sending user message:', response.message);
        }
    };

    const handleConversationClick = async () => { // Replace with your actual user ID
        const data = await fetchMessages(userId, conversationId).json();

        if (data.status === 200) {
            setMessages(data.messages);
        } else {
            console.error('Error fetching messages for conversation:', data.message);
        }
    };

    return (
        <div className="main-page-container">
            <div className="mainpage-navbar-container">
                <Navbar conversationHeaders={conversationHeaders} onConversationClick={handleConversationClick} />
            </div>
            <div className="mainpage-chatarea-container">
                <ChatArea messages={messages}
                    inputMessage={inputMessage}
                    onInputChange={handleInputChange}
                    onSendMessage={handleSendMessage}/>
            </div>
        </div>
    )
}

export default MainPage;