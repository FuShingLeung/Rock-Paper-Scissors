// Sets up inital local storage key-value pairs
export const initialiseLocalStorage = () => {
  setStorage('userScore', 0);
  setStorage('compScore', 0);
  setStorage('tieScore', 0);
  setStorage('username', '');
  setStorage('roundNumber', 0);
  setStorage('gameAlert', 'Rock, Paper or Scissors?');
  removeStorage('gamemode');
};

// Sets a key value pair into local storage
export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
};

// Gets a value from a key from local storage
export const getStorage = (key) => {
  return localStorage.getItem(key);
};

// Removes a key value pair from local storage
export const removeStorage = (key) => {
  localStorage.removeItem(key);
};
