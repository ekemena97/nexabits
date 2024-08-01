import os
import json
from google.cloud import firestore
from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds
import datetime

# Set up Firestore client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/Hp/Desktop/TapTap/nexabit/nexabit2-245fe89ff2e6.JSON"
db = firestore.Client()

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, DatetimeWithNanoseconds):
            return obj.isoformat()
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super(CustomJSONEncoder, self).default(obj)

def fetch_specific_document():
    collection_name = input("Please enter the collection name: ")
    unique_id = input("Please enter the unique ID: ")
    doc_ref = db.collection(collection_name).document(unique_id)
    doc = doc_ref.get()
    
    if doc.exists:
        print(f"Document data: {doc.to_dict()}")
    else:
        print("No such document!")

def fetch_and_save_all_documents():
    collection_name = input("Please enter the collection name: ")
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()
    
    all_docs_data = {}
    count_field_values = {}
    premium_users_count = 0
    bot_users_count = 0

    for doc in docs:
        doc_data = doc.to_dict()
        all_docs_data[doc.id] = doc_data

        count_value = doc_data.get("count")
        if count_value is not None:
            count_field_values[count_value] = count_field_values.get(count_value, 0) + 1

        if doc_data.get("isPremium") == True:
            premium_users_count += 1

        if doc_data.get("isBot") == True:
            bot_users_count += 1

    total_docs = len(all_docs_data)

    output_file = f"{collection_name}.json"
    with open(output_file, 'w') as f:
        json.dump(all_docs_data, f, indent=4, cls=CustomJSONEncoder)
    
    print(f"Total number of documents in the collection '{collection_name}': {total_docs}")
    print(f"Number of premium users (isPremium = true): {premium_users_count}")
    print(f"Number of bot users (isBot = true): {bot_users_count}")

    for count_value, num_docs in count_field_values.items():
        if num_docs >= 2:
            print(f"Number of documents with count value '{count_value}': {num_docs}")

    print(f"All documents have been saved to '{output_file}'")

def main():
    print("Select the functionality to execute:")
    print("1. Fetch and print a specific document by unique ID")
    print("2. Fetch and save all documents in a collection as a JSON file")
    choice = input("Enter the number of the functionality you want to execute (1 or 2): ")
    
    if choice == '1':
        fetch_specific_document()
    elif choice == '2':
        fetch_and_save_all_documents()
    else:
        print("Invalid choice. Please run the script again and enter 1 or 2.")

if __name__ == "__main__":
    main()
