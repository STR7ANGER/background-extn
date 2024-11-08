from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import psutil

app = Flask(__name__)
CORS(app)

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

def clear_database():
    user_apps_collection.delete_many({})
    print("Database cleared.")

def get_running_desired_apps():
    running_apps = set()
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            if proc.info['name'] in desired_apps:
                running_apps.add(proc.info['name'])
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    return list(running_apps) if running_apps else []

def update_user_data(username, apps):
    existing_user = user_apps_collection.find_one({"username": username})
    if existing_user:
        user_apps_collection.update_one(
            {"username": username},
            {"$set": {"apps": apps}}
        )
    else:
        user_apps_collection.insert_one({
            "username": username,
            "apps": apps,
            "meeting_url": ""
        })

def get_all_user_data():
    return [{
        "name": doc["username"],
        "apps": doc["apps"],
        "meeting_url": doc.get("meeting_url", "")
    } for doc in user_apps_collection.find()]

@app.route('/apps')
def apps():
    return jsonify(get_running_desired_apps())

@app.route('/submit-data', methods=['POST'])
def submit_data():
    data = request.json
    username = data.get("username")
    apps = data.get("apps")
    
    if username and apps is not None:
        update_user_data(username, apps)
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error", "message": "Invalid data"}), 400

@app.route('/submit-url', methods=['POST'])
def submit_url():
    url = request.json.get("url")
    if url:
        user_apps_collection.update_many({}, {"$set": {"meeting_url": url}})
        return jsonify({
            "status": "success",
            "message": "Meeting URL updated for all users"
        }), 200
    return jsonify({"status": "error", "message": "Invalid URL"}), 400

@app.route('/meeting-url')
def meeting_url():
    username = request.args.get('username')
    if not username:
        return jsonify({"meeting_url": ""})
    
    user = user_apps_collection.find_one({"username": username})
    return jsonify({
        "meeting_url": user.get("meeting_url", "") if user else ""
    })

@app.route('/admin-data')
def admin_data():
    return jsonify(get_all_user_data())

if __name__ == '__main__':
    clear_database()
    app.run(debug=True)