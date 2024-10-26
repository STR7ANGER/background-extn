import sqlite3

def initialize_db():
    conn = sqlite3.connect("users_data.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS user_apps (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        apps TEXT NOT NULL)''')
    conn.commit()
    conn.close()

initialize_db()
