const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sequence_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSequence' }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;