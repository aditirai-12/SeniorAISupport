const form = document.getElementById('textForm');

//triggerred when form is submitted
form.addEventListener('submit', function(event){
    event.preventDefault(); //prevents the page from refreshing
    get_question();
})

//this function will retrieve the users question
function get_question(){
    //retrieves and saves the users question into a variable
    let userTextBox = document.getElementById("userTxt1")
    let userQuestion = userTextBox.value;
    userTextBox.value = "";

    //checks if the user submission has text
    if(userQuestion.trim() === "") return;

    //adds the question to the chat
    add_question(userQuestion);

    //sends question to the bot
    bot_typing(userQuestion);

}

//this function will add the users question the chat box
function add_question(question){
    let message_history = document.getElementById("chatBox")
    const message = document.createElement("div");

    //initializes the div element
    message.textContent= question;
    message.className = "userMessages"

    //adds the new question to the bottom of the chat
    if(message_history.children.length > 0){
        message_history.insertBefore(message, message_history.children[0])
    }
    else{
        message_history.appendChild(message);
    }
}

//this function will add the bots response
function bot_addQuestion(question, bot_message){
    let message_history = document.getElementById("chatBox")
  //  const bot_message = document.createElement("div");

    //initializes the div element
    bot_message.textContent = "Sorry, I don't have the answer yet";
    bot_message.className = "botMessages";
    bot_message.id = "";

    //adds the new question to the bottom of the chat
    if(message_history.children.length > 0){
        message_history.insertBefore(bot_message, message_history.children[0])
    }
    else{
        message_history.appendChild(bot_message);
    }
}

//this function will create the typing effect animation
function bot_typing(question){
    //retrieves and creates elements
    let message_history = document.getElementById("chatBox")
    const typingBubble = document.createElement('div');
    const text = document.createElement('span');

    //initializes elements and adds typing bubble to main div
    text.id = "typingText";
    typingBubble.className = "botMessages";
    typingBubble.id = "typingBubble";
    typingBubble.appendChild(text);
    message_history.insertBefore(typingBubble, message_history.children[0]);

    //creates constants
    const dots = ['.', '..', '...'];
    let index = 0;
    let rounds = 0;

    //function will animate the typing bubble
    function animateTyping() {
        //delete node and leave function
        if(rounds === 2){
            //message_history.removeChild(typingBubble);
            bot_addQuestion(question, typingBubble);
            return;
        }
        text.textContent = dots[index];
        text.style.width = (2 * index) + 'ch';
        text.style.opacity = '1px';

        //updates index and rounds
        index = (index + 1) % dots.length;
        if(index === 0){
            rounds++;
        }

        setTimeout(animateTyping, 300); // Adjust the timeout for the typing speed
    }
    animateTyping(); // Starts and loops the animation
}



