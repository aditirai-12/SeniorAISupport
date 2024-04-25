//instantiates variables that will hold information
let deviceInfo = " "; //will hold the device info
let currentTheme = ''; //keeps track of the current theme 
let currentFontLevel = 3; //holds the current font level
let maxFontLevel = 6; //holds max font level
let messageFont = 30; //hold current message font size
const form = document.getElementById('textForm'); //hold the textform info
let typingInterval = null; //will keep the status of the typing bubble

//will call the preload.js file to retrieve the users device info
window.electron.getDeviceInfo().then(response => {
    deviceInfo = response; //gets the users device inforation
    console.log(deviceInfo);
}).catch(error => {
    console.error("Error:", error);
});

//first message from the bot
let firstMessage = "Hello, I am Steve your technical assistant. How can I help you today?";
bot_addResponse(firstMessage);

//accesibility feature (theme change)
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    var themeBtn = document.getElementById('toggle-dark-mode'); //gets the theme button 
    const isDarkMode = await window.darkMode.toggle() //calls the theme change function
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light' //changes the label

    //Change the buttons text
    if(isDarkMode ? 'Dark' : 'Light' == 'Dark'){
        themeBtn.textContent = 'Light Mode';
    }
    else{
        themeBtn.textContent = 'Dark Mode';
    } 
});

//accessibility feature (font increase)
document.getElementById('fontIncrease').addEventListener('click', async () =>{
    //get all elements with class name and id
    var messageElemants = document.querySelectorAll('.userMessages, .botMessages');
    var elements = document.querySelectorAll('#accesbilityLabel, .buttons, #Accesbility-menu, #theme-source, #submitBtn, #userTxt1, #topLabel, #bottomLabel');

    //update the message elements
    messageElemants.forEach(function(element) {
        if(currentFontLevel < maxFontLevel){
            var computedFontSize = window.getComputedStyle(element).fontSize; //get current font size
            var currentFontSize = parseFloat(computedFontSize);
            var newFontSize = currentFontSize + 5; //increases font size by 5
            element.style.fontSize = newFontSize + 'px'; //update font size 
        }
    })

    //updates the rest of the elements
    elements.forEach(function(element) {
        if(currentFontLevel < maxFontLevel){
            var computedFontSize = window.getComputedStyle(element).fontSize; //get current font size
            var currentFontSize = parseFloat(computedFontSize);
            var newFontSize = currentFontSize + 0.5; //increases font size by 2
            element.style.fontSize = newFontSize + 'px'; //update font size
        }
    })

    if(currentFontLevel < maxFontLevel){
        //updates font level and current message size
        messageFont += 5;
        currentFontLevel += 1;
        console.log(currentFontLevel)
    }
});

//accesibility feature (font decreases)
document.getElementById('fontDecrease').addEventListener('click', async () =>{
    //get all elements with class name and id
    var messageElemants = document.querySelectorAll('.userMessages, .botMessages');
    var elements = document.querySelectorAll('#accesbilityLabel, .buttons, #Accesbility-menu, #theme-source, #submitBtn, #userTxt1, #topLabel, #bottomLabel');

    //update the message elements
    messageElemants.forEach(function(element) {
        if(currentFontLevel > 1){
            var computedFontSize = window.getComputedStyle(element).fontSize; //get current font size
            var currentFontSize = parseFloat(computedFontSize);
            var newFontSize = currentFontSize - 5; //decreases font size by 5
            element.style.fontSize = newFontSize + 'px'; //update font size
        }
    })

    //updates the rest of the elements
    elements.forEach(function(element) {
        if(currentFontLevel > 1){
            var computedFontSize = window.getComputedStyle(element).fontSize; //get current font size
            var currentFontSize = parseFloat(computedFontSize);
            var newFontSize = currentFontSize - 0.5; //decreases font size by 2
            element.style.fontSize = newFontSize + 'px'; //update font size
        }
    })

    if(currentFontLevel > 1){
        //updates font level and current message size
        messageFont -= 5;
        currentFontLevel -= 1; 
        console.log(currentFontLevel)

    }
})

//triggerred when form is submitted
form.addEventListener('submit', function(event){
    event.preventDefault(); //prevents the page from refreshing
    get_question(); 
})

//This function will create the typing effect
function addTypingAnimation(bot_message) {
    //Display typing animation
    bot_message.textContent = ".";
    typingInterval = setInterval(() => {
        if (bot_message.textContent.endsWith("...")) {
            bot_message.textContent = ".";
        } else {
            bot_message.textContent += ".";
        }
    }, 500); // Adjust typing speed as needed
    

}

//this function will retrieve the users question
async function get_question(){
    //retrieves and saves the users question into a variable
    let userTextBox = document.getElementById("userTxt1");
    let userQuestion = userTextBox.value;
    userTextBox.value = "";

    if(userQuestion.trim() === "") return; //checks if the user submission has text
    add_question(userQuestion); //adds the question to the chat
    userQuestion = 'on ' + deviceInfo + ', ' + userQuestion; //adds the users device info to the user questions 

    //creates a bot message bubble and begins the typing effect
    const bot_message = document.createElement('div'); 
    bot_message.className = "botMessages";
    bot_message.style.fontSize = messageFont + 'px';

    addTypingAnimation(bot_message); //start the typing animation
    let message_history = document.getElementById("chatBox");
    message_history.insertBefore(bot_message, message_history.children[0]); //add message to the bottom

    // Call function from preload script to get bot response
    window.electron.getBotResponse(userQuestion).then(response => {
        //bot_addQuestion(response.content, bot_message) //adds the bots response
        clearInterval(typingInterval); //will stop typing bubble
        bot_message.textContent = response.content;
    }).catch(error => {
        clearInterval(typingInterval); //will stop typing bubble
        console.error("Error:", error);
        bot_message.textContent = "I'm sorry, I don't know the answer.";
    });
}

//this function will add the users question the chat box
function add_question(question){
    let message_history = document.getElementById("chatBox")
    const message = document.createElement("div");

    //initializes the div element
    message.textContent= question;
    message.className = "userMessages"
    message.style.fontSize = messageFont + 'px'; //set font size

    //adds the new question to the bottom of the chat
    if(message_history.children.length > 0){
        message_history.insertBefore(message, message_history.children[0])
    }
    else{
        message_history.appendChild(message);
    }
}

//this function will add the bots response
function bot_addResponse(response){
    let message_history = document.getElementById("chatBox")
    const bot_message = document.createElement('div'); //element used to hold response
    bot_message.className = "botMessages";
    bot_message.id = "";
    bot_message.style.fontSize = messageFont + 'px'; //set font size

    bot_message.textContent = response; //adds the response to the chat history
    message_history.insertBefore(bot_message, message_history.children[0]); //add message to the bottom
}