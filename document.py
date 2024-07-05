import os
from google.cloud import firestore

# Set up Firestore client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/Hp/Desktop/TapTap/nexabit/nexabit2-245fe89ff2e6.JSON"
db = firestore.Client()

# Prompt the user to enter the unique ID
collection_name = "TapUsers"
unique_id = input("Please enter the unique ID: ")

# Get the document
doc_ref = db.collection(collection_name).document(unique_id)
doc = doc_ref.get()

if doc.exists:
    print(f"Document data: {doc.to_dict()}")
else:
    print("No such document!")
