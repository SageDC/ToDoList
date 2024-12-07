import React, { useState, useEffect } from 'react';

const ws = new WebSocket('ws://localhost:3000');

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // listen for WebSocket messages
  useEffect(() => {
    ws.onmessage = (event) => {
      const updatedTasks = JSON.parse(event.data);
      setTasks(updatedTasks);
    };
  }, []);

  const addTask = () => {
    const updatedTasks = [...tasks, { text: newTask, done: false }];
    setTasks(updatedTasks);
    ws.send(JSON.stringify(updatedTasks));
    setNewTask('');
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) => (
        i ===index ? { ...task, done: !task.done } : task
    ));
    setTasks(updatedTasks);
    ws.send(JSON.stringify(updatedTasks));
  };

  return (
      <div>
        <h1>Shared To-Do List</h1>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
        <u1>
          {tasks.map((task, index) => (
              <li
                key={index}
              style={{
                textDecoration: task.done ? 'line-through' : 'none',
              }}
              onClick={() => toggleTask(index)}
              >
                {task.text}
              </li>
          ))}
        </u1>
      </div>
  );
}

export default App;