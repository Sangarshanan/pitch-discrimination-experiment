import React, { useState } from 'react';
import { ExperimentResults } from './types';
import { AirtableService } from './airtableService';
import { getAirtableConfig } from './config';

interface ResultsViewProps {
  results: ExperimentResults;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, onRestart }) => {
  const [isSavingToAirtable, setIsSavingToAirtable] = useState(false);
  const [airtableStatus, setAirtableStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [airtableErrorMessage, setAirtableErrorMessage] = useState<string>('');

  const airtableConfig = getAirtableConfig();

  const saveToAirtable = async () => {
    if (!airtableConfig) {
      setAirtableErrorMessage('Airtable configuration is not set up. Please check your config.ts file.');
      setAirtableStatus('error');
      return;
    }

    setIsSavingToAirtable(true);
    setAirtableStatus('idle');
    setAirtableErrorMessage('');

    try {
      const airtableService = new AirtableService(airtableConfig);
      await airtableService.saveResults(results);
      setAirtableStatus('success');
    } catch (error) {
      setAirtableStatus('error');
      setAirtableErrorMessage(error instanceof Error ? error.message : 'Failed to save to Airtable');
    } finally {
      setIsSavingToAirtable(false);
    }
  };

  const saveResults = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `pitch-discrimination-${results.participant.name.replace(/\s+/g, '-')}-${timestamp}.json`;

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = filename;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const voiceTrials = results.trials.filter(t => t.soundType === 'voice');
  const pianoTrials = results.trials.filter(t => t.soundType === 'piano');

  const voiceAccuracy = voiceTrials.length > 0
    ? (voiceTrials.filter(t => t.isCorrect).length / voiceTrials.length) * 100
    : 0;

  const pianoAccuracy = pianoTrials.length > 0
    ? (pianoTrials.filter(t => t.isCorrect).length / pianoTrials.length) * 100
    : 0;

  const averageResponseTime = results.trials.length > 0
    ? results.trials.reduce((sum, t) => sum + t.responseTime, 0) / results.trials.length
    : 0;

  const experimentDuration = Math.round(
    (results.endTime.getTime() - results.startTime.getTime()) / 1000
  );

  return (
    <div className="app">
      <div className="results-container">
        <h1>Experiment Complete!</h1>

        <div className="results-summary">
          <h2>Your Results</h2>

          <p><strong>Participant:</strong> {results.participant.name}</p>
          {results.participant.age && <p><strong>Age:</strong> {results.participant.age}</p>}
          {results.participant.yearsMusicalExperience !== undefined && (
            <p><strong>Musical Experience:</strong> {results.participant.yearsMusicalExperience} years</p>
          )}
          {results.participant.instrument && (
            <p><strong>Primary Instrument:</strong> {results.participant.instrument}</p>
          )}

          <hr style={{ margin: '20px 0', border: '1px solid black' }} />

          <h3>Pitch Discrimination Thresholds</h3>
          <p><strong>Voice Threshold:</strong> {results.voiceThreshold} Hz</p>
          <p><strong>Piano Threshold:</strong> {results.pianoThreshold} Hz</p>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Lower thresholds indicate better pitch discrimination ability.
          </p>

          <h3>Performance Summary</h3>
          <p><strong>Voice Trials Accuracy:</strong> {voiceAccuracy.toFixed(1)}% ({voiceTrials.filter(t => t.isCorrect).length}/{voiceTrials.length})</p>
          <p><strong>Piano Trials Accuracy:</strong> {pianoAccuracy.toFixed(1)}% ({pianoTrials.filter(t => t.isCorrect).length}/{pianoTrials.length})</p>
          <p><strong>Average Response Time:</strong> {(averageResponseTime / 1000).toFixed(2)} seconds</p>
          <p><strong>Total Experiment Time:</strong> {Math.floor(experimentDuration / 60)}:{(experimentDuration % 60).toString().padStart(2, '0')}</p>

          <h3>Interpretation</h3>
          <p>
            {results.voiceThreshold <= 2 && results.pianoThreshold <= 2 && (
              "Excellent pitch discrimination! You can detect very small pitch differences."
            )}
            {((results.voiceThreshold > 2 && results.voiceThreshold <= 4) || (results.pianoThreshold > 2 && results.pianoThreshold <= 4)) && (
              "Good pitch discrimination ability. You can detect moderate pitch differences reliably."
            )}
            {results.voiceThreshold > 4 && results.pianoThreshold > 4 && (
              "Your pitch discrimination is developing. With practice, you may improve your ability to detect smaller differences."
            )}
          </p>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {airtableConfig && (
            <button
              className="btn"
              onClick={saveToAirtable}
              disabled={isSavingToAirtable}
              style={{
                backgroundColor: airtableStatus === 'success' ? '#4CAF50' :
                                airtableStatus === 'error' ? '#f44336' : '#007bff'
              }}
            >
              {isSavingToAirtable ? 'Saving to Airtable...' :
               airtableStatus === 'success' ? 'Saved to Airtable ✓' :
               airtableStatus === 'error' ? 'Airtable Error ✗' :
               'Save to Airtable'}
            </button>
          )}
          <button className="btn" onClick={saveResults}>
            Download Results (JSON)
          </button>
          <button className="btn" onClick={onRestart}>
            Run Another Test
          </button>
        </div>

        {airtableStatus === 'error' && airtableErrorMessage && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px',
            color: '#c62828'
          }}>
            <strong>Airtable Error:</strong> {airtableErrorMessage}
          </div>
        )}

        {airtableStatus === 'success' && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#e8f5e8',
            border: '1px solid #4CAF50',
            borderRadius: '4px',
            color: '#2e7d32'
          }}>
            <strong>Success!</strong> Results have been saved to Airtable.
          </div>
        )}

        {!airtableConfig && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            color: '#856404'
          }}>
            <strong>Note:</strong> Airtable integration is not configured. Please add your API key and Base ID to config.ts to enable automatic data saving.
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          <p>
            Results are automatically saved to your downloads folder when you click "Download Results".
            The file contains detailed trial-by-trial data for further analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;