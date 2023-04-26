const messageContainer = document.querySelector('.message-container')
const messageInput = document.querySelector('.message-input')
const sendMessageForm = document.querySelector('.send-message-form')
const socket = io('http://localhost:3000')
socket.emit('setup', sendMessageForm.dataset.chat)
sendMessageForm.addEventListener('submit', async e => {
    e.preventDefault()
    const response = await fetch(`/chat/${sendMessageForm.dataset.chat}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: messageInput.value
        })
    })
    if (response.status == 200) {
        socket.emit('new message', { message: messageInput.value })
        const newMessage = document.createElement('div')
        newMessage.classList.add('sent')
        newMessage.innerText = `${messageContainer.dataset.sender}: ${messageInput.value}`
        messageContainer.append(newMessage)
    }
    messageInput.value = ''
})
socket.on('new message', newMessage => {
    const receivedMessage = document.createElement('div')
    receivedMessage.classList.add('received')
    receivedMessage.innerText = `${messageContainer.dataset.receiver}: ${newMessage.message}`
    messageContainer.append(receivedMessage)
})