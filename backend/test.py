from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://aditya-28:Aditya28@cluster0.rg5pk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)



#keep
# MongoDB Atlas connection
'''
client = MongoClient("mongodb+srv://aditya-28:Aditya28@cluster0.rg5pk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['user_data']
user_apps_collection = db['user_app']
'''