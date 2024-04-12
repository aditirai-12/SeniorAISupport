const { contextBridge, ipcRenderer } = require('electron');
const OpenAI = require("openai");
const os = require('os');
const si = require('systeminformation');

//preload script that will call the openai's api and send it's response back to 
//the renderer index.js page to be displayed 
contextBridge.exposeInMainWorld('electron', {
    getBotResponse: async (question) => {
        const openai = new OpenAI({
            apiKey: "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",
            dangerouslyAllowBrowser: true //double check !!
        });

        //chatbots prompt 
        const gpt_assistant_prompt = "You are a tech support assistant helping seniors who are above 65 years old.";

        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: gpt_assistant_prompt }, { "role": "user", "content": question }],
            model: "ft:gpt-3.5-turbo-0125:fourcher-tech:thirdtry3:9CynSjtj",
        });

        return response.choices[0].message;
    },

    getDeviceInfo: async () => {
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
        model = data.manufacturer + ' ' + data.model;

        //concatonate the info and return it
        deviceInfo = model + ', ' + osInfo.platform + ' os, release ' + osInfo.release;
        return deviceInfo;
    }

});

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
});