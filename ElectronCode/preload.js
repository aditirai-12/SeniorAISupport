const { contextBridge, ipcRenderer } = require('electron');
const OpenAI = require("openai");
const os = require('os');
const si = require('systeminformation'); //needed to get mac device info
//const { exec } = require('child_process'); //needed to get microsoft device info

let messages_collected = []; // will hold the message history

//preload script that will call the openai's api and send it's response back to 
//the renderer index.js page to be displayed 
//function will retrieve and return the device informatiom
function execWmic(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

contextBridge.exposeInMainWorld('electron', {
    getBotResponse: async (question) => {
        const openai = new OpenAI({
            apiKey: "sk-proj-eGJXiZ1fScdmxledeYjIT3BlbkFJIGviHWQxdyuQYxhltoBr",
            dangerouslyAllowBrowser: true //double check !!
        });

        //chatbots prompt 
        const gpt_assistant_prompt = "You are a tech support assistant helping seniors who are above 65 years old.";

        api_message = [
            { role: "system", content: gpt_assistant_prompt }, 
            { "role": "user", "content": question }];

        //will add the messages to the array and thus the history
        messages_collected = messages_collected.concat(api_message);
        
        const response = await openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo-0125:fourcher-tech:4-22-24:9GiOf6sC",
            //messages: [{ role: "system", content: gpt_assistant_prompt }, { "role": "user", "content": question }],
            messages: messages_collected,
        });

        return response.choices[0].message;
    },

    //Will get correct device information for devices using Windows 
    getDeviceInfo: async () => {
        /*try {
            //Calls function to grab model and os info
            const model = await execWmic('wmic computersystem get model');
            const osInfo = await execWmic('wmic os get caption,version');
    
            //split the output by lines to store the needed info
            const osInfoParts = osInfo.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            const modelInfo = model.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
            // Ensure that both caption and version are available
            if (osInfoParts.length >= 2) {
                const osCaption = osInfoParts[1]; //grab the needs portion of os info

                deviceInfo = 'Currently on '+ modelInfo[1] + ', ' + osCaption; //appens the device info together
                return deviceInfo;
            } else {
                throw new Error('Unable to parse OS information from WMIC output.');
            }
        } catch (error) {
            console.error('Error retrieving computer information:', error);
            throw error;
        }*/

        //Code to get device info on Mac devices !
        let deviceInfo = ""; //will hold device model info 

        //get OS information
        const osInfo = {
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
            arch: os.arch()
        };

        //retrieves the device make/model
        const data = await si.system();
        model = data.manufacturer+ ' ' + data.model;

        //concatonate the info and return it
        deviceInfo = 'Currently on '+ model + ', ' + osInfo.platform;
        
        return deviceInfo;
    }
});


contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle')
});