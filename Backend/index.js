const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const UserModel = require('./src/Schemas/users');
const ChatSequenceModel = require('./src/Schemas/chat');
const ConnectDB = require("./src/db");
const nodemailer = require('nodemailer');

ConnectDB();

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
    session({
        secret: "qw1er2ty3ui4op5",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
        },
    })
);

const generateObjectID = () => {
    return mongoose.Types.ObjectId();
};

// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// Function to send OTP to the user's email
const sendOTP = async (email, otp) => {
    try {
        // Set up nodemailer transporter with your email service configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dr0458571@gmail.com',
                pass: 'wwnv nuwp gzib pjqu',
            },
        });

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'dr0458571@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Verification OTP', // Subject line
            text: `Your OTP for verification is: ${otp}`, // plain text body
        });

        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Route to get the currently stored OTP and set up user ID in session
app.post('/getOtp', (req, res) => {
    try {
        const { otp } = req.body;

        // Check if the provided OTP matches the one stored in the session
        if (req.session.otp && req.session.otp === otp) {
            // Clear the stored OTP from session after successful verification
            delete req.session.otp;

            // Set up user ID in the session (replace 'userId' with the actual user ID)

            res.status(200).json({ success: true, message: 'OTP verified successfully', user_id: req.session.userId });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to add a user and send OTP
app.post('/addUser', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if the email is already associated with an existing user
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            // Email is already present, send OTP for verification
            const otp = generateOTP();
            req.session.otp = otp;
            sendOTP(email, otp);
            req.session.userId = existingUser._id;
            return res.status(200).json({ success: true, message: 'Email already registered, OTP sent for verification' });
        }

        // Email is not present, create a new user
        const newUser = new UserModel({ name, email });
        await newUser.save();
        req.session.userId = existingUser._id;

        // Generate OTP
        const otp = generateOTP();

        // Save OTP to session for verification
        req.session.otp = otp;

        // Send OTP to the user's email
        sendOTP(email, otp);

        // Assuming you have a ChatSequence model schema defined in './src/models/chatSequence'
        const newChatSequence = new ChatSequenceModel({ user_id: newUser._id });
        await newChatSequence.save();

        res.status(201).json({ success: true, message: 'User added successfully, OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to add a message to the current user's sequence and current conversation
app.post('/addUserMessage', async (req, res) => {
    try {
        const { user_id, conversation_id, userMessage } = req.body;

        const currentUser = await UserModel.findById(user_id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatSequence = await ChatSequenceModel.findOne({ user_id: currentUser._id });

        if (!chatSequence) {
            return res.status(404).json({ message: 'Chat sequence not found for the user' });
        }

        const currentConversation = chatSequence.conversations.find(conv => conv.conversation_id.equals(conversation_id));

        if (!currentConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        currentConversation.userMessages.push({
            message: userMessage,
            timestamp: new Date(),
        });

        await chatSequence.save();

        res.status(201).json({ message: 'User message added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to add a bot message to the current user's sequence and current conversation
app.post('/addBotMessage', async (req, res) => {
    try {
        const { user_id, conversation_id, botMessage } = req.body;

        const currentUser = await UserModel.findById(user_id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatSequence = await ChatSequenceModel.findOne({ user_id: currentUser._id });

        if (!chatSequence) {
            return res.status(404).json({ message: 'Chat sequence not found for the user' });
        }

        const currentConversation = chatSequence.conversations.find(conv => conv.conversation_id.equals(conversation_id));

        if (!currentConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        currentConversation.botMessages.push({
            message: botMessage,
            timestamp: new Date(),
        });

        await chatSequence.save();

        res.status(201).json({ message: 'Bot message added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to add a new conversation with user and bot messages and timestamps
app.post('/addConversation', async (req, res) => {
    try {
        const { user_id, userMessages, botMessages } = req.body;

        const currentUser = await UserModel.findById(user_id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatSequence = await ChatSequenceModel.findOne({ user_id: currentUser._id });

        if (!chatSequence) {
            return res.status(404).json({ message: 'Chat sequence not found for the user' });
        }

        const conversation_id = generateObjectID();

        chatSequence.conversations.push({
            conversation_id,
            userMessages: userMessages.map(message => ({
                message,
                timestamp: new Date(),
            })),
            botMessages: botMessages.map(message => ({
                message,
                timestamp: new Date(),
            })),
        });

        await chatSequence.save();

        res.status(201).json({ message: 'Conversation added successfully', conversation_id: conversation_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch conversation IDs for a user
app.post('/fetchConversationIDs', async (req, res) => {
    try {
        const { user_id } = req.body;

        const currentUser = await UserModel.findById(user_id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatSequence = await ChatSequenceModel.findOne({ user_id: currentUser._id });

        if (!chatSequence) {
            return res.status(404).json({ message: 'Chat sequence not found for the user' });
        }

        const conversationIDs = chatSequence.conversations.map(conv => conv.conversation_id);
        res.status(200).json({ conversationIDs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch messages for a particular conversation
app.post('/fetchMessages', async (req, res) => {
    try {
        const { user_id, conversation_id } = req.body;

        const currentUser = await UserModel.findById(user_id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chatSequence = await ChatSequenceModel.findOne({ user_id: currentUser._id });

        if (!chatSequence) {
            return res.status(404).json({ message: 'Chat sequence not found for the user' });
        }

        const currentConversation = chatSequence.conversations.find(conv => conv.conversation_id.equals(conversation_id));

        if (!currentConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const messages = {
            userMessages: currentConversation.userMessages,
            botMessages: currentConversation.botMessages,
        };

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
