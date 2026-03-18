import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Breathe.css';

const Breathe = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState('4-7-8');
  const [isInteractive, setIsInteractive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [breathingHistory, setBreathingHistory] = useState([]);
  const [showCustomPattern, setShowCustomPattern] = useState(false);
  const [customPattern, setCustomPattern] = useState({ inhale: 4, hold: 4, exhale: 4, name: 'Custom' });
  const [targetCycles, setTargetCycles] = useState(5);
  const audioContextRef = useRef(null);

  const patterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing' },
    'box': { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing' },
    'calm': { inhale: 5, hold: 2, exhale: 6, name: 'Calm Breathing' },
    'custom': customPattern
  };

  // Initialize audio context
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, [soundEnabled]);

  // Play sound notification
  const playSound = useCallback((frequency = 440, duration = 200) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, [soundEnabled]);

  const nextPhase = useCallback(() => {
    const currentPattern = patterns[selectedPattern];
    if (phase === 'ready') {
      setPhase('inhale');
      setTimeLeft(currentPattern.inhale);
      playSound(523, 300); // C5 note
    } else if (phase === 'inhale') {
      setPhase('hold');
      setTimeLeft(currentPattern.hold);
      playSound(659, 200); // E5 note
    } else if (phase === 'hold') {
      setPhase('exhale');
      setTimeLeft(currentPattern.exhale);
      playSound(784, 200); // G5 note
    } else if (phase === 'exhale') {
      setCycles(cycles => cycles + 1);
      setPhase('inhale');
      setTimeLeft(currentPattern.inhale);
      playSound(523, 300); // C5 note

      // Check if target cycles reached
      if (cycles + 1 >= targetCycles) {
        setTimeout(() => {
          stopSession();
          playSound(1047, 500); // C6 note for completion
        }, currentPattern.inhale * 1000);
      }
    }
  }, [phase, selectedPattern, playSound, cycles, targetCycles]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      nextPhase();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, nextPhase]);

  // Session duration tracking
  useEffect(() => {
    let durationInterval = null;
    if (isActive && sessionStartTime) {
      durationInterval = setInterval(() => {
        setSessionDuration(Date.now() - sessionStartTime);
      }, 1000);
    }
    return () => clearInterval(durationInterval);
  }, [isActive, sessionStartTime]);

  const handleCircleClick = () => {
    if (!isActive) {
      setIsInteractive(true);
      setTimeout(() => setIsInteractive(false), 1000);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setCycles(0);
    setSessionStartTime(Date.now());
    setSessionDuration(0);
    nextPhase();
    playSound(880, 400); // A5 note
  };

  const stopSession = () => {
    setIsActive(false);
    setPhase('ready');
    setTimeLeft(4);
    setCycles(0);

    // Save session to history
    if (sessionStartTime) {
      const sessionData = {
        date: new Date().toISOString(),
        pattern: selectedPattern,
        cycles: cycles,
        duration: sessionDuration,
        targetCycles: targetCycles
      };
      setBreathingHistory(prev => [sessionData, ...prev.slice(0, 9)]); // Keep last 10 sessions
    }

    setSessionStartTime(null);
    setSessionDuration(0);
  };

  const resetSession = () => {
    stopSession();
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const saveCustomPattern = () => {
    setSelectedPattern('custom');
    setShowCustomPattern(false);
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getCircleSize = () => {
    const baseSize = 100;
    const maxSize = 200;
    const currentPattern = patterns[selectedPattern];

    if (phase === 'inhale') {
      const progress = (currentPattern.inhale - timeLeft) / currentPattern.inhale;
      return baseSize + (maxSize - baseSize) * progress;
    } else if (phase === 'exhale') {
      const progress = timeLeft / currentPattern.exhale;
      return maxSize - (maxSize - baseSize) * (1 - progress);
    }
    return baseSize;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'ready': return 'Ready to begin';
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return '';
    }
  };

  const getBreathingGuide = () => {
    switch (phase) {
      case 'inhale': return '↑';
      case 'hold': return '●';
      case 'exhale': return '↓';
      default: return '○';
    }
  };

  const getProgressPercentage = () => {
    if (!isActive || targetCycles === 0) return 0;
    return Math.min((cycles / targetCycles) * 100, 100);
  };

  return (
    <section className="breathe-section">
      <h2>Mindful Breathing</h2>
      <p>Take a moment to center yourself and flow with your breath</p>

      {/* Session Controls */}
      <div className="session-controls">
        <div className="control-group">
          <label>Target Cycles: </label>
          <select value={targetCycles} onChange={(e) => setTargetCycles(Number(e.target.value))} disabled={isActive}>
            {[1, 3, 5, 10, 15, 20].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <button className={`sound-toggle ${soundEnabled ? 'active' : ''}`} onClick={toggleSound}>
          {soundEnabled ? '🔊' : '🔇'} Sound
        </button>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">{cycles}/{targetCycles} cycles</span>
        </div>
      )}

      <div className="pattern-selector">
        <h3>Choose Your Breathing Pattern</h3>
        <div className="pattern-buttons">
          {Object.entries(patterns).filter(([key]) => key !== 'custom').map(([key, pattern]) => (
            <button
              key={key}
              className={`pattern-btn ${selectedPattern === key ? 'active' : ''}`}
              onClick={() => setSelectedPattern(key)}
              disabled={isActive}
            >
              {pattern.name}
            </button>
          ))}
          <button
            className={`pattern-btn ${selectedPattern === 'custom' ? 'active' : ''} ${showCustomPattern ? 'editing' : ''}`}
            onClick={() => setShowCustomPattern(!showCustomPattern)}
            disabled={isActive}
          >
            Custom
          </button>
        </div>

        {/* Custom Pattern Editor */}
        {showCustomPattern && (
          <div className="custom-pattern-editor">
            <h4>Create Custom Pattern</h4>
            <div className="custom-inputs">
              <div className="input-group">
                <label>Inhale (s):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customPattern.inhale}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, inhale: Number(e.target.value) }))}
                />
              </div>
              <div className="input-group">
                <label>Hold (s):</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={customPattern.hold}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, hold: Number(e.target.value) }))}
                />
              </div>
              <div className="input-group">
                <label>Exhale (s):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customPattern.exhale}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, exhale: Number(e.target.value) }))}
                />
              </div>
            </div>
            <button className="save-custom-btn" onClick={saveCustomPattern}>Save Pattern</button>
          </div>
        )}
      </div>

      <div className="breathing-circle">
        <div
          className={`circle ${phase} ${isActive ? 'active' : ''} ${isInteractive ? 'interactive' : ''}`}
          style={{
            width: `${getCircleSize()}px`,
            height: `${getCircleSize()}px`
          }}
          onClick={handleCircleClick}
        >
          <div className="circle-content">
            <div className="breathing-guide">{getBreathingGuide()}</div>
            <div className="phase-text">{getPhaseText()}</div>
            {isActive && <div className="timer">{timeLeft}</div>}
            {cycles > 0 && <div className="cycles">Cycles: {cycles}</div>}
            {isActive && <div className="session-time">Time: {formatDuration(sessionDuration)}</div>}
          </div>
          <div className="progress-ring"></div>
        </div>
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      <div className="controls">
        {!isActive ? (
          <button className="start-btn" onClick={startSession}>
            Start Breathing Session
          </button>
        ) : (
          <div className="active-controls">
            <button className="stop-btn" onClick={stopSession}>
              Stop
            </button>
            <button className="reset-btn" onClick={resetSession}>
              Reset
            </button>
          </div>
        )}
      </div>

      <div className="breathing-info">
        <div className="pattern-info">
          <h4>{patterns[selectedPattern].name}</h4>
          <p>Inhale: {patterns[selectedPattern].inhale}s</p>
          <p>Hold: {patterns[selectedPattern].hold}s</p>
          <p>Exhale: {patterns[selectedPattern].exhale}s</p>
          <p>Total Cycle: {patterns[selectedPattern].inhale + patterns[selectedPattern].hold + patterns[selectedPattern].exhale}s</p>
        </div>

        <div className="session-stats">
          <h4>Session Statistics</h4>
          <p>Total Sessions: {breathingHistory.length}</p>
          <p>Last Session: {breathingHistory.length > 0 ? `${breathingHistory[0].cycles} cycles` : 'None'}</p>
          <p>Current Streak: {breathingHistory.filter(s => s.cycles >= targetCycles).length} sessions</p>
        </div>

        <div className="benefits">
          <h4>Benefits of Mindful Breathing</h4>
          <ul>
            <li>Reduces stress and anxiety</li>
            <li>Improves focus and concentration</li>
            <li>Promotes emotional balance</li>
            <li>Enhances overall well-being</li>
            <li>Lowers blood pressure</li>
            <li>Improves sleep quality</li>
          </ul>
        </div>
      </div>

      {/* Breathing History */}
      {breathingHistory.length > 0 && (
        <div className="breathing-history">
          <h3>Recent Sessions</h3>
          <div className="history-list">
            {breathingHistory.slice(0, 5).map((session, index) => (
              <div key={index} className="history-item">
                <span>{new Date(session.date).toLocaleDateString()}</span>
                <span>{session.pattern} - {session.cycles} cycles</span>
                <span>{formatDuration(session.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Breathe;