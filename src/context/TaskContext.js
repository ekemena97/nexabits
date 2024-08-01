import React, { createContext, useContext, useState, useEffect } from "react";
import { useTapContext } from "./TapContext.js";
import { realTasks } from "../data/index.js";
import { getStorageItem, setStorageItem } from '../components/storageHelpers.js';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { incrementPoints } = useTapContext();
  const [completedTasks, setCompletedTasks] = useState({});
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const loadCompletedTasks = async () => {
      try {
        const savedCompletedTasks = await getStorageItem("completedTasks");
        console.log('Loaded completed tasks:', savedCompletedTasks); // Add this line
        if (savedCompletedTasks) {
          setCompletedTasks(savedCompletedTasks);
        }
      } catch (error) {
        console.error("Error loading completedTasks from Cloud Storage:", error);
      }
    };

    // Load timers from local storage
    const savedTimers = localStorage.getItem("timers");
    console.log('Saved timers:', savedTimers); // Add this line
    if (savedTimers) {
      try {
        setTimers(JSON.parse(savedTimers));
      } catch (error) {
        console.error("Error parsing timers from local storage:", error);
        setTimers({});
      }
    }

    loadCompletedTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedTimers = { ...timers };

      Object.keys(timers).forEach((key) => {
        const { startTime, duration } = timers[key];
        const elapsed = now - startTime;
        if (elapsed >= duration) {
          delete updatedTimers[key];

          setCompletedTasks((prev) => {
            const newCompletedTasks = { ...prev, [key]: true };
            setStorageItem("completedTasks", newCompletedTasks); // Save to Cloud Storage
            return newCompletedTasks;
          });

          incrementPoints(parseInt(realTasks[key.split("-")[0]].task[key.split("-")[1]].task_points));
        }
      });

      setTimers(updatedTimers);
      localStorage.setItem("timers", JSON.stringify(updatedTimers)); // Save timers to local storage
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, incrementPoints]);

  const startTaskTimer = (taskIndex, duration) => {
    const startTime = Date.now();
    const newTimers = {
      ...timers,
      [taskIndex]: { startTime, duration },
    };

    setTimers(newTimers);
    localStorage.setItem("timers", JSON.stringify(newTimers)); // Save timers to local storage
  };

  const markTaskAsCompleted = (taskIndex) => {
    setCompletedTasks((prev) => {
      const newCompletedTasks = { ...prev, [taskIndex]: true };
      setStorageItem("completedTasks", newCompletedTasks); // Save to Cloud Storage
      return newCompletedTasks;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        completedTasks,
        timers,
        startTaskTimer,
        markTaskAsCompleted,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
