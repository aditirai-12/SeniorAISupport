import openai
import os

open.api_key = os.getenv("put the key in here") #loads API key

# list where all messages for context are stored
messages = [
        {"role": "system", "content": "CHANGE THIS!!!!!!!!."},
    ]

def techSupportBot(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.ChatCompletion.create(
       model = "gpt-4",  #specifies GPT model
       messages = messages
   )
    
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})  #appends reply to messages list
    return reply 
    
