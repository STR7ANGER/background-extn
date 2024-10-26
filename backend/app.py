from flask import Flask, jsonify, request
import psutil

app = Flask(__name__)

# Sample data for demonstration; replace with actual user data as needed
users_data = {
    "Alice": ["chrome.exe", "zoom.exe"],
    "Bob": ["firefox.exe", "slack.exe"],
    "Charlie": ["discord.exe", "teams.exe"]
}

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

@app.route('/apps')
def apps():
    apps_list = get_running_desired_apps()
    return jsonify(apps_list)

@app.route('/admin-data')
def admin_data():
    # Return data of all users and their running applications
    return jsonify([{"name": name, "apps": apps} for name, apps in users_data.items()])

if __name__ == '__main__':
    app.run(debug=True)
