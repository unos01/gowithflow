import React, { useState } from 'react';
import './Datame.css';

const Datame = () => {
  const [data, setData] = useState([
    { 
      id: 1, 
      name: 'Daily Mindfulness Practice', 
      status: 'Active', 
      progress: 75,
      description: 'Consistent meditation and present-moment awareness'
    },
    { 
      id: 2, 
      name: 'Habit Formation Journey', 
      status: 'Pending', 
      progress: 30,
      description: 'Building positive routines and breaking old patterns'
    },
    { 
      id: 3, 
      name: 'Emotional Awareness Growth', 
      status: 'Completed', 
      progress: 100,
      description: 'Understanding and accepting emotions as they flow'
    },
    { 
      id: 4, 
      name: 'Stress Management Mastery', 
      status: 'Active', 
      progress: 60,
      description: 'Developing resilience and adaptive coping strategies'
    },
    { 
      id: 5, 
      name: 'Goal Achievement Flow', 
      status: 'Active', 
      progress: 45,
      description: 'Aligning actions with life purpose and values'
    },
  ]);

  const updateProgress = (id) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, progress: Math.min(item.progress + 10, 100) }
          : item
      )
    );
  };

  return (
    <section className="datame-section">
      <h2>Data Flows</h2>
      <p className="section-description">
        Track your personal growth journey and see how you're flowing through life's challenges
      </p>
      <div className="flows-container">
        {data.map(flow => (
          <div key={flow.id} className="flow-card">
            <h3>{flow.name}</h3>
            <p className="flow-description">{flow.description}</p>
            <div className="flow-status">
              <span className={`status-badge ${flow.status.toLowerCase()}`}>
                {flow.status}
              </span>
              <span className="progress-text">{flow.progress}% Complete</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${flow.progress}%` }}
              ></div>
            </div>
            <button
              className="update-btn"
              onClick={() => updateProgress(flow.id)}
              disabled={flow.progress >= 100}
            >
              {flow.progress >= 100 ? 'Completed' : 'Advance Flow'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Datame;