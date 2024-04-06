const { contextBridge, ipcRenderer } = require('electron');
const OpenAI = require("openai");

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
            model: "gpt-3.5-turbo",
        });

        return response.choices[0].message;
    }
});
