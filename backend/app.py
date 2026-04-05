import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import random

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
DB_PATH = os.path.join(BASE_DIR, 'tracker.db')

app = Flask(__name__, template_folder=FRONTEND_DIR, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

# Database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS otp (
            email TEXT,
            code TEXT
        )
    ''')

    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard.html")
def dashboard():
    return render_template("dashboard.html")

@app.route("/alerts.html")
def alerts():
    return render_template("alerts.html")

@app.route("/settings.html")
def settings():
    return render_template("settings.html")

@app.route("/track.html")
def track():
    return render_template("track.html")

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    try:
        c.execute("INSERT INTO users (username,email,password) VALUES (?,?,?)",
                  (data['username'],data['email'],data['password']))
        conn.commit()
        return jsonify({"status":"success"})
    except:
        return jsonify({"status":"exists"})


# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE email=? AND password=?",
              (data['email'],data['password']))

    if c.fetchone():
        return jsonify({"status":"success"})
    else:
        return jsonify({"status":"invalid"})


# OTP
@app.route('/send-otp', methods=['POST'])
def send_otp():
    email = request.json['email']
    otp = str(random.randint(1000,9999))

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("DELETE FROM otp WHERE email=?", (email,))
    c.execute("INSERT INTO otp VALUES (?,?)", (email,otp))
    conn.commit()

    return jsonify({"otp": otp})
devices=[]

@app.route("/add_device",methods=["POST"])
def add_device():

    data=request.json

    devices.append({
        "name":data["name"],
        "device_id":data["device_id"],
        "location":data["location"]
    })

    return jsonify({"status":"success"})

@app.route('/verify-otp', methods=['POST'])
def verify():
    data = request.json

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("SELECT * FROM otp WHERE email=? AND code=?",
              (data['email'],data['code']))

    if c.fetchone():
        return jsonify({"status":"verified"})
    else:
        return jsonify({"status":"invalid"})

@app.route("/devices")
def get_devices():
    return jsonify(devices)
if __name__ == '__main__':
    app.run(debug=True)