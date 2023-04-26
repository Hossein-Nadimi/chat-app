const { default: mongoose } = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    message: { type: String }
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    users: { type: [mongoose.Types.ObjectId], ref: 'user' },
    messages: { type: [messageSchema] }
}, { timestamps: true, toJSON: { virtuals: true } })

module.exports = {
    ChatModel: mongoose.model('chat', chatSchema)
}