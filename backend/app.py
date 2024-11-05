from flask import Flask, jsonify, request
import sqlite3
import psutil

app = Flask(__name__)

# List of apps to track
desired_apps = [
    "Zoom.exe", "Teams.exe", "chrome.exe", "firefox.exe",
    "msedge.exe", "safari.exe", "opera.exe", "brave.exe",
    "iexplore.exe", "Webex.exe", "Skype.exe", "slack.exe", "Discord.exe"
]

def get_running_desired_apps():
    running_apps = set()
    for proc in psutil.process_iter(['pid', 'name']):
        if proc.info['name'] in desired_apps:
            running_apps.add(proc.info['name'])
    return list(running_apps) if running_apps else []

def add_user_data_to_db(username, apps):
    conn = sqlite3.connect("users_data.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO user_apps (username, apps) VALUES (?, ?)", (username, ",".join(apps)))
    conn.commit()
    conn.close()

def get_all_user_data():
    conn = sqlite3.connect("users_data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT username, apps FROM user_apps")
    data = [{"name": row[0], "apps": row[1].split(",")} for row in cursor.fetchall()]
    conn.close()
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
    app.run(debug=True)
