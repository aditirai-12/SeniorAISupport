import psycopg2
from flask import Flask, request, render_template, jsonify
import sqlite3
import os
import wandb
from openai import OpenAI
import psutil
import json
import platform

app = Flask(__name__)

def get_hardware_info():
    # Get CPU information
    cpu_info = {
        "cpu_cores": psutil.cpu_count(logical=False),
        "cpu_threads": psutil.cpu_count(logical=True),
        "cpu_frequency": psutil.cpu_freq().current,
        "cpu_usage": psutil.cpu_percent()
    }

    # Get Memory (RAM) information
    memory_info = {
        "total_memory": psutil.virtual_memory().total,
        "available_memory": psutil.virtual_memory().available,
        "used_memory": psutil.virtual_memory().used,
        "memory_percent": psutil.virtual_memory().percent
    }

    # Get Disk information
    disk_info = {
        "total_disk_space": psutil.disk_usage('/').total,
        "used_disk_space": psutil.disk_usage('/').used,
        "free_disk_space": psutil.disk_usage('/').free,
        "disk_percent": psutil.disk_usage('/').percent
    }

    # Get Network information
    network_info = {
        "network_io_counters": psutil.net_io_counters()
    }

    return {
        "cpu_info": cpu_info,
        "memory_info": memory_info,
        "disk_info": disk_info,
        "network_info": network_info
    }

def get_software_info():
    # Get OS information
    os_info = {
        "os_platform": platform.platform(),
        "os_version": platform.version()
    }

    # Get Python version
    python_info = {
        "python_version": platform.python_version()
    }

    return {
        "os_info": os_info,
        "python_info": python_info
    }


@app.route('/')
def index():
   return render_template('chatbot_ui.html')

@app.route('/chatbot')
def aboutUsPage():
    return render_template('chatbot_ui.html')

@app.route('/call_chatbot', methods=['POST'])
def calling_chatbot():
    if request.method == 'POST':
       #q = request.form['userQuesHolder']
       data = request.get_json()  # Retrieve data from JSON payload
       question = data.get('data', '')

       api_key = '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'
       client = OpenAI(api_key=api_key)

       gpt_assistant_prompt = "You are a tech support assistant helping seniors who are above 65 years old."
       gpt_user_prompt = question
       gpt_prompt = gpt_assistant_prompt, gpt_user_prompt

       message=[{"role": "assistant", "content": gpt_assistant_prompt}, {"role": "user", "content": gpt_user_prompt}]
       max_tokens=256

       response = client.chat.completions.create(
           model="ft:gpt-3.5-turbo-1106:fourcher-tech:sts:96W5Uohf",
           messages = message,
           max_tokens=max_tokens
       )

       chatbot_response = str(response.choices[0].message)
       # Find the start and end index of the content
       start_index = chatbot_response.find("content=") + len("content=")
       end_index = chatbot_response.find(", role=")

       # Extract the content substring
       content_string = chatbot_response[start_index:end_index].strip()


       return content_string

@app.route('/hardware_info')
def hardware_info():
    #return jsonify(get_hardware_info())
    return get_hardware_info()

@app.route('/software_info')
def software_info():
    return jsonify(get_software_info())

if __name__ == '__main__':
    app.run(debug=True)