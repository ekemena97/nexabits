// firebaseHelper.js

/**
 * Save data (key-value pairs) either to backend API or localStorage.
 * @param {string|null} userId - The user's unique identifier, if available.
 * @param {object} data - The data to be saved (key-value pairs).
 */
export const saveData = async (userId, data) => {
  try {
    if (userId) {
      // Save data to backend if userId is provided
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data to backend');
      }

      console.log('Data saved to backend:', { id: userId, ...data });
    } else {
      // Save data to localStorage as a fallback
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      console.log('Data saved to localStorage:', data);
    }
  } catch (error) {
    console.error('Error saving data:', error);

    // Fallback to localStorage on error
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key, JSON.stringify(data[key]));
    });
  }
};

/**
 * Fetch data (key-value pairs) either from backend API or localStorage.
 * @param {string|null} userId - The user's unique identifier, if available.
 * @param {array} keys - The keys to retrieve.
 * @returns {object} The retrieved data (key-value pairs).
 */
export const fetchData = async (userId, keys) => {
  const result = {};

  try {
    if (userId) {
      // Fetch data from backend if userId is provided
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user?userId=${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('User not found in backend, falling back to localStorage');
          keys.forEach((key) => {
            result[key] = JSON.parse(localStorage.getItem(key));
          });
          return result;
        }
        throw new Error('Failed to fetch data from backend');
      }

      const userData = await response.json();
      console.log('Data fetched from backend:', userData);

      // Extract only the requested keys
      keys.forEach((key) => {
        result[key] = userData[key];
      });

      return result;
    } else {
      // Fetch data from localStorage as a fallback
      keys.forEach((key) => {
        result[key] = JSON.parse(localStorage.getItem(key));
      });
      console.log('Data fetched from localStorage:', result);

      return result;
    }
  } catch (error) {
    console.error('Error fetching data:', error);

    // Fallback to localStorage on error
    keys.forEach((key) => {
      result[key] = JSON.parse(localStorage.getItem(key));
    });

    return result;
  }
};

/**
 * Clear specific keys from localStorage.
 * @param {array} keys - The keys to clear.
 */
export const clearData = (keys) => {
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
  console.log('Data cleared from localStorage:', keys);
};
