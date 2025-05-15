from telethon.sync import TelegramClient

print("Enter your phone number (with country code, e.g., +1234567890):")
phone_number = input()

client = TelegramClient('session', API_ID, API_HASH)
client.connect()

if not client.is_user_authorized():
    client.send_code_request(phone_number)
    print("Enter the code sent to your Telegram:")
    code = input()
    client.sign_in(phone_number, code)

print("Session started successfully!")
client.disconnect()
