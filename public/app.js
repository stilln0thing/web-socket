const socket = io('ws://localhost:3500')

const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')

// Function to send user message to OpenAI API
function sendMessageToOpenAI(message) {
    console.log("hu")
    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'sk-proj-pgacwlnwxDHxyrrvdzuNT3BlbkFJsNYtUIQXffR6vGEsAK1t'
        },
        body: JSON.stringify({
            prompt: message,
            max_tokens: 50,
            engine: 'davinci-codex'
        })
    })
    .then(response => response.json())
    .then(data => {
        // Display OpenAI response in chat interface
        const text = data.choices[0].text;
        const time = new Date().toLocaleTimeString();
        const messageData = { name: 'OpenAI', text, time };
        displayMessage(messageData);
    })
    .catch(error => {
        console.error('Error:', error);
        // Display error message in chat interface
        const errorMessage = 'Error: Failed to process message';
        const time = new Date().toLocaleTimeString();
        const errorData = { name: 'Error', text: errorMessage, time };
        displayMessage(errorData);
    });
}

// Function to send user message
function sendMessage(e) {
    e.preventDefault();
    if (nameInput.value && msgInput.value && chatRoom.value) {
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value
        });
        // Send message to OpenAI API
        sendMessageToOpenAI(msgInput.value);
        msgInput.value = "";
    }
    msgInput.focus();
}

// Other existing code...

// Listen for messages 
socket.on("message", (data) => {
    // Existing message handling code...
});

// Existing code...

// Function to display messages in the chat interface
function displayMessage(messageData) {
    const { name, text, time } = messageData;
    activity.textContent = "";
    const li = document.createElement('li');
    li.className = 'post';
    if (name === nameInput.value) li.className = 'post post--left';
    if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right';
    if (name !== 'Admin') {
        li.innerHTML = `<div class="post__header ${name === nameInput.value
            ? 'post__header--user'
            : 'post__header--reply'
            }">
        <span class="post__header--name">${name}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`;
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`;
    }
    chatDisplay.appendChild(li);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Other existing code...
