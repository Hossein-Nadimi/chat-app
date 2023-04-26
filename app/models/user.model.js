const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    nameId: { type: String },
})

module.exports = {
    UserModel: mongoose.model('user', userSchema)
}