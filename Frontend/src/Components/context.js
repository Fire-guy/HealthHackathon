import React, { createContext, useContext, useState } from 'react';

const API_URL = 'http://localhost:5000';
const FLASK_API_URL = 'http://localhost:5002';

const Context = createContext();

const useAPI = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useAPI must be used within an APIProvider');
    }
    return context;
};

const APIProvider = ({ children }) => {

    const [flag, setFlag] = useState(0);
    const [userId, setUserId] = useState(null);
    const [conversationId, setConversationId] = useState(null);

    const addUser = async (name, email) => {
        try {
            const response = await fetch(`${API_URL}/addUser`, { 
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(name, email),
                credentials: 'include',
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding user:', error);
            return { success: false, message: 'Error adding user' };
        }
    };

    const addUserMessage = async (user_id, conversation_id, userMessage) => {
        try {
            const response = await fetch(`${API_URL}/addUserMessage`, { 
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(user_id, conversation_id, userMessage),
                credentials: 'include', 
            });
            if(response.ok) {
                console.log("successful");
                fetchMessages(user_id, conversation_id);
                return response.json();
            }
            else {
                return { success: false, message: 'Error in adding message' };
            }
        } catch (error) {
            console.error('Error adding user message:', error);
            return { success: false, message: 'Error adding user message' };
        }
    };

    const addBotMessage = async (user_id, conversation_id, botMessage) => {
        try {
            const response = await fetch(`${API_URL}/addBotMessage`, { 
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(user_id, conversation_id, botMessage),
                credentials: 'include', 
            });
            if(response.ok) {
                console.log("Bot Successful");
                fetchMessages(user_id, conversation_id);
            }
        } catch (error) {
            console.error('Error adding bot message:', error);
            return { success: false, message: 'Error adding bot message' };
        }
    };

    const addConversation = async (user_id, userMessages, botMessages) => {
        try {
            const response = await fetch(`${API_URL}/addConversation`, { 
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(userMessages,user_id, botMessages),
                credentials: 'include',
            });
            setConversationId(response.data.conversation_id);
            return await response.json();
        } catch (error) {
            console.error('Error adding conversation:', error);
            return { success: false, message: 'Error adding conversation' };
        }
    };

    const fetchConversationIDs = async (user_id) => {
        try {
            const response = await fetch(`${API_URL}/fetchConversationIDs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_id),
                credentials: 'include',
            });
            setFlag(1);
            setConversationId(response.data.conversationIDs);
            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation IDs:', error);
            return { success: false, message: 'Error fetching conversation IDs' };
        }
    };

    const fetchMessages = async (user_id, conversation_id) => {
        try {
            const response = await fetch(`${API_URL}/fetchMessages`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(conversation_id,user_id),
                credentials: 'include',

            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            return { success: false, message: 'Error fetching messages' };
        }
    };

    const getOtp = async (otp) => {
        try {
            const response = await fetch(`${API_URL}/getOtp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp }),
            });
            const data = await response.json();
            setUserId(data.userId);
            return data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return { success: false, message: 'Error verifying OTP' };
        }
    };


    return (
        <Context.Provider value={{ addUser, addUserMessage, addBotMessage, addConversation,
            fetchConversationIDs, fetchMessages, getOtp, API_URL, flag, conversationId, userId, FLASK_API_URL }}>
            {children}
        </Context.Provider>
    );
};



export { APIProvider, useAPI };
