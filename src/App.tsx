import React, { useState } from 'react';
import ParticipantForm from './ParticipantForm';
import ExperimentInterface from './ExperimentInterface';
import ThankYouPage from './ThankYouPage';
import { ParticipantInfo, ExperimentResults } from './types';

type AppState = 'form' | 'experiment' | 'thankyou';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo | null>(null);
  const [experimentResults, setExperimentResults] = useState<ExperimentResults | null>(null);

  const handleParticipantSubmit = (info: ParticipantInfo) => {
    setParticipantInfo(info);
    setCurrentState('experiment');
  };

  const handleExperimentComplete = (results: ExperimentResults) => {
    setExperimentResults(results);
    setCurrentState('thankyou');
  };

  const handleRestart = () => {
    setParticipantInfo(null);
    setExperimentResults(null);
    setCurrentState('form');
  };

  switch (currentState) {
    case 'form':
      return <ParticipantForm onSubmit={handleParticipantSubmit} />;

    case 'experiment':
      return participantInfo ? (
        <ExperimentInterface
          participantInfo={participantInfo}
          onComplete={handleExperimentComplete}
        />
      ) : null;

    case 'thankyou':
      return participantInfo ? (
        <ThankYouPage
          participantName={participantInfo.name}
          onRestart={handleRestart}
        />
      ) : null;

    default:
      return null;
  }
};

export default App;