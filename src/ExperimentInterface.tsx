import React, { useState, useEffect, useCallback } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { ExperimentLogic } from './ExperimentLogic';
import { ParticipantInfo, TrialResult, ExperimentResults, AudioTriplet } from './types';
import { getTrialCount, getAirtableConfig } from './config';
import { AirtableService } from './airtableService';

interface ExperimentInterfaceProps {
  participantInfo: ParticipantInfo;
  onComplete: (results: ExperimentResults) => void;
}

const ExperimentInterface: React.FC<ExperimentInterfaceProps> = ({
  participantInfo,
  onComplete,
}) => {
  const [audioPlayer] = useState(() => new AudioPlayer());
  const [experimentLogic] = useState(() => new ExperimentLogic());

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trialSequence] = useState(() => experimentLogic.generateTrialSequence());
  const [currentTriplet, setCurrentTriplet] = useState<AudioTriplet | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [userResponse, setUserResponse] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [trialStartTime, setTrialStartTime] = useState<number>(0);
  const [experimentStartTime] = useState(() => new Date());
  const totalTrials = getTrialCount();

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioPlayer.initialize();
        setIsInitialized(true);
        generateNextTrial();
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initializeAudio();

    return () => {
      audioPlayer.destroy();
    };
  }, [audioPlayer]);

  const generateNextTrial = useCallback(() => {
    if (currentTrial >= totalTrials) {
      return;
    }

    const soundType = trialSequence[currentTrial];
    const triplet = experimentLogic.generateTriplet(soundType);
    setCurrentTriplet(triplet);
    setHasPlayed(false);
    setUserResponse(null);
    setFeedback('');
    setShowFeedback(false);
    setTrialStartTime(Date.now());
  }, [currentTrial, trialSequence, experimentLogic]);

  const playAudioSequence = async () => {
    if (!currentTriplet || isPlaying) {
      console.log('Skipping playback - currentTriplet:', !!currentTriplet, 'isPlaying:', isPlaying);
      return;
    }

    console.log('Starting audio playback...');
    setIsPlaying(true);
    try {
      const soundType = trialSequence[currentTrial];
      const frequencies = currentTriplet.sounds.map(s => s.frequency);

      console.log('About to play sequence:', { soundType, frequencies, currentTrial });
      await audioPlayer.playSequence(soundType, frequencies, 500);
      console.log('Sequence completed successfully');
      setHasPlayed(true);
    } catch (error) {
      console.error('Error playing audio sequence:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Audio playback error: ${errorMessage}`);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleChoice = (position: number) => {
    if (!currentTriplet || userResponse !== null) return;

    const responseTime = Date.now() - trialStartTime;
    const isCorrect = position === currentTriplet.correctPosition;

    setUserResponse(position);

    const soundType = trialSequence[currentTrial];
    const baseFreq = currentTriplet.sounds.find(s => !s.isDifferent)?.frequency || 0;
    const diffFreq = currentTriplet.sounds.find(s => s.isDifferent)?.frequency || 0;
    const pitchDifference = Math.abs(diffFreq - baseFreq);

    const trialResult: Omit<TrialResult, 'isCorrect'> = {
      trialNumber: currentTrial + 1,
      soundType,
      baseFrequency: baseFreq,
      differentFrequency: diffFreq,
      pitchDifference,
      correctPosition: currentTriplet.correctPosition,
      userResponse: position,
      responseTime,
      timestamp: new Date(),
    };

    const completeResult = experimentLogic.processResponse(isCorrect, soundType, trialResult);
    setTrials(prev => [...prev, completeResult]);

    setFeedback('Thank you for your response.');
    setShowFeedback(true);

    setTimeout(async () => {
      if (currentTrial >= totalTrials - 1) {
        const results: ExperimentResults = {
          participant: participantInfo,
          trials: [...trials, completeResult],
          voiceThreshold: experimentLogic.getVoiceThreshold(),
          pianoThreshold: experimentLogic.getPianoThreshold(),
          startTime: experimentStartTime,
          endTime: new Date(),
        };

        // Automatically save to Airtable if configured
        const airtableConfig = getAirtableConfig();
        if (airtableConfig) {
          try {
            const airtableService = new AirtableService(airtableConfig);
            await airtableService.saveResults(results);
            console.log('Results automatically saved to Airtable');
          } catch (error) {
            console.error('Failed to save to Airtable:', error);
          }
        }

        onComplete(results);
      } else {
        setCurrentTrial(prev => prev + 1);
      }
    }, 2000);
  };

  useEffect(() => {
    if (currentTrial > 0 && currentTrial <= totalTrials) {
      generateNextTrial();
    }
  }, [currentTrial, generateNextTrial, totalTrials]);

  if (!isInitialized) {
    return (
      <div className="app">
        <div className="experiment-container">
          <h2>Loading audio files...</h2>
          <p>Please wait while we prepare the experiment.</p>
        </div>
      </div>
    );
  }

  const soundType = trialSequence[currentTrial];
  const currentThreshold = experimentLogic.getCurrentThreshold(soundType);
  const completedVoiceTrials = trials.filter(t => t.soundType === 'voice').length;
  const completedPianoTrials = trials.filter(t => t.soundType === 'piano').length;

  return (
    <div className="app">
      <div className="experiment-container">
        <h1>Pitch Discrimination Test</h1>

        <div className="progress-info">
          <p><strong>Trial:</strong> {currentTrial + 1} of {totalTrials}</p>
          <p><strong>Current sound:</strong> {soundType === 'voice' ? 'Human Voice' : 'Piano'}</p>
          <p><strong>Completed:</strong> Voice: {completedVoiceTrials}/{Math.ceil(totalTrials/2)}, Piano: {completedPianoTrials}/{Math.floor(totalTrials/2)}</p>
        </div>

        <div className="audio-controls">
          <button
            className="play-button"
            onClick={playAudioSequence}
            disabled={isPlaying || showFeedback}
          >
            {isPlaying ? 'Playing...' : 'Play Audio Sequence'}
          </button>
        </div>

        <p>Listen carefully and identify which sound (1st, 2nd, or 3rd) is different:</p>

        <div className="choice-buttons">
          <button
            className="choice-btn"
            onClick={() => handleChoice(0)}
            disabled={!hasPlayed || userResponse !== null || isPlaying}
          >
            1st
          </button>
          <button
            className="choice-btn"
            onClick={() => handleChoice(1)}
            disabled={!hasPlayed || userResponse !== null || isPlaying}
          >
            2nd
          </button>
          <button
            className="choice-btn"
            onClick={() => handleChoice(2)}
            disabled={!hasPlayed || userResponse !== null || isPlaying}
          >
            3rd
          </button>
        </div>

        {showFeedback && (
          <div className="feedback">
            {feedback}
          </div>
        )}

        {!hasPlayed && !isPlaying && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Click "Play Audio Sequence" to begin this trial
          </p>
        )}
      </div>
    </div>
  );
};

export default ExperimentInterface;