const mongoose = require('mongoose');

const userMessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const botMessageSchema = new mongoose.Schema({
  bot: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true },
  userMessages: [userMessageSchema],
  botMessages: [botMessageSchema],
});

const chatSequenceSchema = new mongoose.Schema({
  sequence_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversations: [conversationSchema],
});

const ChatSequenceModel = mongoose.model('ChatSequence', chatSequenceSchema);

module.exports = ChatSequenceModel;
