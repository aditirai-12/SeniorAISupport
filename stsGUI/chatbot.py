import psycopg2
from flask import Flask, request, render_template
import sqlite3

app = Flask(__name__) 
@app.route('/')
def index():
   return render_template('chatbot_ui.html')

if __name__ == '__main__':
    app.run(debug=True)