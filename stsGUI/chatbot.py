import psycopg2
from flask import Flask, request, render_template, jsonify
import sqlite3
import os
import wandb
from openai import OpenAI

app = Flask(__name__) 
@app.route('/')
def index():
   return render_template('chatbot_ui.html')

@app.route('/call_chatbot', methods=['POST'])
def calling_chatbot():
    if request.method == 'POST':
       #q = request.form['userQuesHolder']
       data = request.get_json()  # Retrieve data from JSON payload
       question = data.get('data', '')

       api_key = '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'
       client = OpenAI(api_key=api_key)

       gpt_assistant_prompt = "You are a tech support assistant helping seniors who are above 65 years old. Answer in 5 words"
       gpt_user_prompt = question
       gpt_prompt = gpt_assistant_prompt, gpt_user_prompt

       message=[{"role": "assistant", "content": gpt_assistant_prompt}, {"role": "user", "content": gpt_user_prompt}]
       max_tokens=256

       response = client.chat.completions.create(
           model="gpt-4",
           messages = message,
           max_tokens=max_tokens
       )

       chatbot_response = str(response.choices[0].message)

       chatbot_response = chatbot_response.split('\'')
       return chatbot_response[1]



    
if __name__ == '__main__':
    app.run(debug=True)