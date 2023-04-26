const socketHandler = (io) => {
    io.on('connection', socket => {
        socket.on('setup', chatId => {
            socket.join(chatId)
            socket.on('new message', newMessage => {
                socket.to(chatId).emit('new message', newMessage)
            })
        })
    })
}

module.exports = {
    socketHandler
}