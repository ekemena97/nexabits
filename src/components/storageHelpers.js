const isTelegramWebApp = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.CloudStorage;

export const getStorageItem = (key) => {
  return new Promise((resolve, reject) => {
    if (isTelegramWebApp) {
      window.Telegram.WebApp.CloudStorage.getItem(key, (err, value) => {
        if (err || !value) {
          console.log(`Storage item "${key}" fetched:`, value);
          return resolve(null); // Return null instead of rejecting
        }
        try {
          const parsedValue = JSON.parse(value);
          console.log(`Parsed storage item "${key}":`, parsedValue);
          resolve(parsedValue);
        } catch (parseError) {
          console.error(`Error parsing storage item "${key}":`, parseError);
          resolve(null);
        }
      });
    } else {
      const value = localStorage.getItem(key);
      console.log(`Local storage item "${key}" fetched:`, value);
      if (!value) {
        return resolve(null); // Return null instead of rejecting
      }
      try {
        const parsedValue = JSON.parse(value);
        console.log(`Parsed local storage item "${key}":`, parsedValue);
        resolve(parsedValue);
      } catch (parseError) {
        console.error(`Error parsing local storage item "${key}":`, parseError);
        resolve(null);
      }
    }
  });
};

export const setStorageItem = (key, value) => {
  const jsonString = JSON.stringify(value);
  console.log(`Setting storage item "${key}" to:`, jsonString);
  return new Promise((resolve, reject) => {
    if (isTelegramWebApp) {
      window.Telegram.WebApp.CloudStorage.setItem(key, jsonString, (err) => {
        if (err && err.message === "WebAppMethodUnsupported") {
          localStorage.setItem(key, jsonString);
          console.log(`Saved to localStorage "${key}":`, localStorage.getItem(key));
          resolve();
        } else if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      localStorage.setItem(key, jsonString);
      console.log(`Saved to localStorage "${key}":`, localStorage.getItem(key));
      resolve();
    }
  });
};