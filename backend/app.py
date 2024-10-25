from flask import Flask, jsonify
import psutil

app = Flask(__name__)

desired_apps = [
    "Zoom.exe",
    "Teams.exe",
    "chrome.exe",
    "firefox.exe",
    "msedge.exe",
    "safari.exe",
    "opera.exe",
    "brave.exe",
    "iexplore.exe",
    "Webex.exe",
    "Skype.exe",
    "slack.exe",
    "Discord.exe"
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

if __name__ == '__main__':
    app.run(debug=True)
