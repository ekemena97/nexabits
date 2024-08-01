import { useTelegramUser } from './TelegramContext.js';

const updateFirestoreUser = async (user, setStateChanged) => {
  const userId = useTelegramUser();
  if (!userId) {
    console.error('User ID is not available.');
    return;
  }

  console.log(`Updating Firestore for user: ${userId} with data:`, user);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const text = await response.text();
    try {
      JSON.parse(text);
    } catch (jsonError) {
      console.warn('Non-JSON response:', text);
    }

    setStateChanged && setStateChanged(false);
    console.log('Firestore user updated successfully.');
  } catch (error) {
    console.error(`Error updating user data: ${error}`);
  }
};

export { updateFirestoreUser };
