function sendMessage() {

    let message = document.getElementById("message").value;

    if(message.trim() === ""){
        return;
    }

    let chatbox = document.getElementById("chatbox");

    chatbox.innerHTML += `
    <p><b>You:</b> ${message}</p>
    `;

    chatbox.innerHTML += `
    <p id="typing"><i>Bot is typing...</i></p>
    `;

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {

        let typing = document.getElementById("typing");

        if(typing){
            typing.remove();
        }

        chatbox.innerHTML += `
        <p>
        <b>Bot:</b> ${data.answer}
        <br>
        Confidence: ${data.confidence}%
        </p>
        `;

        chatbox.scrollTop = chatbox.scrollHeight;

        document.getElementById("message").value = "";
    })
    .catch(error => {
        console.log(error);
    });
}

function toggleMode(){
    document.body.classList.toggle("dark");
}

function startVoice(){

    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice input not supported in this browser");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = function(event){

        document.getElementById("message").value =
        event.results[0][0].transcript;

    };

    recognition.start();
}