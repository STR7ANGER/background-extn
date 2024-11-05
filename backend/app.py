from flask import Flask, jsonify, request
from pymongo import MongoClient
import psutil

app = Flask(__name__)

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://aditya-28:Aditya28@cluster0.rg5pk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['user_data']
user_apps_collection = db['user_app']

# List of apps to track
desired_apps = [
    "Zoom.exe", "Teams.exe", "chrome.exe", "firefox.exe",
    "msedge.exe", "safari.exe", "opera.exe", "brave.exe",
    "iexplore.exe", "Webex.exe", "Skype.exe", "slack.exe", "Discord.exe"
]

# Clear the database collection at server start
def clear_database():
    user_apps_collection.delete_many({})  # Deletes all documents in the collection
    print("Database cleared.")

# Function to retrieve running desired applications
def get_running_desired_apps():
    running_apps = set()
    for proc in psutil.process_iter(['pid', 'name']):
        if proc.info['name'] in desired_apps:
            running_apps.add(proc.info['name'])
    return list(running_apps) if running_apps else []

# Add user data to MongoDB
def add_user_data_to_db(username, apps):
    user_apps_collection.insert_one({"username": username, "apps": apps})

# Retrieve all user data from MongoDB
def get_all_user_data():
    data = []
    for doc in user_apps_collection.find():
        data.append({"name": doc["username"], "apps": doc["apps"]})
    return data

@app.route('/apps')
def apps():
    apps_list = get_running_desired_apps()
    return jsonify(apps_list)

@app.route('/submit-data', methods=['POST'])
def submit_data():
    data = request.json
    username = data.get("username")
    apps = data.get("apps")
    if username and apps:
        add_user_data_to_db(username, apps)
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error", "message": "Invalid data"}), 400

@app.route('/admin-data')
def admin_data():
    data = get_all_user_data()
    return jsonify(data)

if __name__ == '__main__':
    clear_database()  # Clear the database when the server starts
    app.run(debug=True)
