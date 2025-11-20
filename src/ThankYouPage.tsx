import React from 'react';

interface ThankYouPageProps {
  participantName: string;
  onRestart: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ participantName, onRestart }) => {
  return (
    <div className="app">
      <div className="experiment-container">
        <h1>All done!</h1>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2>🎵 You did great 🎵</h2>

          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            ❤️ Thank you, <strong>{participantName}</strong> for participating in our pitch discrimination study.
          </p>

          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            Your responses have been automatically saved.
          </p>

          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Your contribution to this research is greatly appreciated :)
          </p>

          <div style={{ marginTop: '40px' }}>
            <button
              className="btn"
              onClick={onRestart}
              style={{
                fontSize: '16px',
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Take the Experiment Again
            </button>
          </div>

          <p style={{ fontSize: '14px', color: '#888', marginTop: '30px' }}>
            You may close this window or click the button above if you'd like to participate again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;