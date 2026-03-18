import React, { useState, useEffect } from 'react';
import './Me.css';

const Me = () => {
  const [currentFlow, setCurrentFlow] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [userReflections, setUserReflections] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const flows = [
    {
      title: "Go with the Flow",
      description: "Embrace the natural rhythm of life and let things unfold organically.",
      icon: "🌊",
      benefits: ["Reduced stress", "Better adaptability", "Natural harmony"],
      practice: "Take 3 deep breaths and let go of control"
    },
    {
      title: "Mindful Movement",
      description: "Stay present and aware as you navigate through your daily experiences.",
      icon: "🧘",
      benefits: ["Enhanced awareness", "Better focus", "Emotional balance"],
      practice: "Notice 5 things you can see, hear, and feel right now"
    },
    {
      title: "Adaptive Growth",
      description: "Grow and evolve by adapting to changes rather than resisting them.",
      icon: "🌱",
      benefits: ["Personal growth", "Resilience building", "New opportunities"],
      practice: "List 3 things you're grateful for today"
    },
    {
      title: "Harmonious Balance",
      description: "Find balance between action and rest, effort and ease.",
      icon: "⚖️",
      benefits: ["Sustainable energy", "Better work-life balance", "Inner peace"],
      practice: "Spend 5 minutes in silence, just being present"
    }
  ];

  const quotes = [
    {
      text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
      author: "Alan Watts"
    },
    {
      text: "Life is a series of natural and spontaneous changes. Don't resist them; that only creates sorrow.",
      author: "Lao Tzu"
    },
    {
      text: "The art of life lies in taking pleasures as they pass, and the keenest pleasures are not intellectual, but are found in the heart.",
      author: "Aristotle"
    },
    {
      text: "Be like water making its way through cracks. Do not be assertive, but adjust to the object, and you shall find a way around or through it.",
      author: "Bruce Lee"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showReflection) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentFlow((prev) => (prev + 1) % flows.length);
          setIsAnimating(false);
        }, 300);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [flows.length, showReflection]);

  const handleCardClick = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
      setCurrentFlow(index);
    }
  };

  const handleReflectionChange = (flowIndex, reflection) => {
    setUserReflections(prev => ({
      ...prev,
      [flowIndex]: reflection
    }));
  };

  const toggleReflection = () => {
    setShowReflection(!showReflection);
  };

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  return (
    <section className="me-section">
      <h2>About Flow</h2>
      <p>Explore different aspects of going with the flow in your life</p>

      <div className="reflection-toggle">
        <button
          className={`reflection-btn ${showReflection ? 'active' : ''}`}
          onClick={toggleReflection}
        >
          {showReflection ? '✖ Close Reflection' : '📝 Personal Reflection'}
        </button>
      </div>

      {showReflection ? (
        <div className="reflection-mode">
          <h3>Reflect on Your Flow Journey</h3>
          <div className="reflection-cards">
            {flows.map((flow, index) => (
              <div key={index} className="reflection-card">
                <div className="reflection-header">
                  <span className="reflection-icon">{flow.icon}</span>
                  <h4>{flow.title}</h4>
                </div>
                <textarea
                  placeholder={`How does "${flow.title}" show up in your life? What have you learned about this principle?`}
                  value={userReflections[index] || ''}
                  onChange={(e) => handleReflectionChange(index, e.target.value)}
                  rows="3"
                />
                <div className="practice-tip">
                  <strong>💡 Practice:</strong> {flow.practice}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flow-display">
            {flows.map((flow, index) => (
              <div
                key={index}
                className={`flow-card ${index === currentFlow ? 'active' : ''} ${expandedCard === index ? 'expanded' : ''} ${isAnimating && index === currentFlow ? 'fade-out' : 'fade-in'}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="flow-icon">{flow.icon}</div>
                <h3>{flow.title}</h3>
                <p>{flow.description}</p>

                {expandedCard === index && (
                  <div className="expanded-content">
                    <div className="benefits-list">
                      <h4>Benefits:</h4>
                      <ul>
                        {flow.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="practice-section">
                      <h4>Daily Practice:</h4>
                      <p>{flow.practice}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flow-navigation">
            {flows.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentFlow ? 'active' : ''}`}
                onClick={() => setCurrentFlow(index)}
                title={`Go to ${flows[index].title}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="inspiration-quote interactive-quote" onClick={nextQuote}>
        <blockquote>
          "{quotes[currentQuote].text}"
        </blockquote>
        <cite>- {quotes[currentQuote].author}</cite>
        <div className="quote-hint">Click for inspiration ✨</div>
      </div>
    </section>
  );
};

export default Me;