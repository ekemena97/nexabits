// src/context/TaskContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTapContext } from "./TapContext.js";
import { realTasks } from "../data/index.js";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { incrementPoints } = useTapContext();
  const [completedTasks, setCompletedTasks] = useState({});
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const savedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || {};
    const savedTimers = JSON.parse(localStorage.getItem("timers")) || {};

    setCompletedTasks(savedCompletedTasks);
    setTimers(savedTimers);
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
            localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
            return newCompletedTasks;
          });

          incrementPoints(parseInt(realTasks[key.split("-")[0]].task[key.split("-")[1]].task_points));
        }
      });

      setTimers(updatedTimers);
      localStorage.setItem("timers", JSON.stringify(updatedTimers));
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
    localStorage.setItem("timers", JSON.stringify(newTimers));
  };

  const markTaskAsCompleted = (taskIndex) => {
    setCompletedTasks((prev) => {
      const newCompletedTasks = { ...prev, [taskIndex]: true };
      localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
      return newCompletedTasks;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        completedTasks,
        timers,
        startTaskTimer,
        markTaskAsCompleted, // Provide the markTaskAsCompleted function
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);