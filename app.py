import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Yahan hum Flask ko bol rahe hain ki template aur static dono current folder (.) hi hain
app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

# Application Configurations & Security Encryption Key
app.config['SECRET_KEY'] = 'netflix_cyber_secret_9988'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///netflix_users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==========================================================================
# DATABASE SCHEMATICS MODEL
# ==========================================================================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f'<User Profile Locked: {self.email}>'

# Auto creation matrix for DB
with app.app_context():
    db.create_all()
    print("[*] Netflix Local Security Engine Database Active and Configured (Flat Structure).")

# ==========================================================================
# CONTROLLER ROUTING LOGIC
# ==========================================================================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['GET'])
def signup_page():
    return render_template('signup.html')

@app.route('/signin', methods=['GET'])
def signin_page():
    return render_template('signin.html')

@app.route('/browse')
def browse():
    return render_template('browse.html')

@app.route('/tvshows')
def tvshows():
    return render_template('tvshows.html')

@app.route('/movies')
def movies():
    return render_template('movies.html')

@app.route('/newpopular')
def newpopular():
    return render_template('newpopular.html')

@app.route('/mylist')
def mylist():
    return render_template('mylist.html')

# ==========================================================================
# API ENDPOINTS FOR DATA PERSISTENCE
# ==========================================================================

@app.route('/api/auth/signup', methods=['POST'])
def handle_api_signup():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and Password are required."}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"success": False, "message": "Email already registered inside database."}), 400

    hashed_pwd = generate_password_hash(password, method='scrypt')
    new_user = User(email=email, password=hashed_pwd)
    
    db.session.add(new_user)
    db.session.commit()
    
    print(f"\n[+] NEW USER REGISTERED IN TERMINAL: {email}\n")
    return jsonify({"success": True, "message": "Account committed to production storage."})

@app.route('/api/auth/signin', methods=['POST'])
def handle_api_signin():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        session['user_profile'] = user.email
        print(f"\n[!] ACCESS GRANTED / USER LOGGED IN: {email}\n")
        return jsonify({"success": True, "redirect": "/browse"})
    
    print(f"\n[-] FAILED AUTHENTICATION ATTEMPT FOR: {email}\n")
    return jsonify({"success": False, "message": "Invalid credentials profile verification."}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)