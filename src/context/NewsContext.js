// NewsContext.js
import { createContext, useContext, useState } from 'react';
import { tasks } from '../data';


const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [news, setNews] = useState({tasks}); // Your News array
  
  console.log(news);

  return (
    <NewsContext.Provider value={{ news, setNews }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return useContext(NewsContext);
}
