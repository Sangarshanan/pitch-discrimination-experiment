import Airtable from 'airtable';
import { ExperimentResults } from './types';

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName?: string;
}

class AirtableService {
  private base: any;
  private tableName: string;

  constructor(config: AirtableConfig) {
    if (!config.apiKey || !config.baseId) {
      throw new Error('Airtable API key and Base ID are required');
    }

    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: config.apiKey
    });

    this.base = Airtable.base(config.baseId);
    this.tableName = config.tableName || 'Experiment Results';
  }

  async saveResults(results: ExperimentResults): Promise<void> {
    try {
      // Helper function to handle empty values
      const getValue = (value: any): string => {
        if (value === null || value === undefined || value === '') {
          return 'Not Provided';
        }
        return String(value);
      };

      // Create a simple record with just the essential data as text
      const record = {
        fields: {
          'Participant_Name': getValue(results.participant.name),
          'Age': getValue(results.participant.age),
          'Gender': getValue(results.participant.gender),
          'Native_Language': getValue(results.participant.nativeLanguage),
          'Musical_Experience': getValue(results.participant.yearsMusicalExperience),
          'Primary_Instrument': getValue(results.participant.instrument),
          'Voice_Threshold': String(results.voiceThreshold),
          'Piano_Threshold': String(results.pianoThreshold),
          'Voice_Accuracy': String(this.calculateAccuracy(results.trials.filter(t => t.soundType === 'voice')).toFixed(1)) + '%',
          'Piano_Accuracy': String(this.calculateAccuracy(results.trials.filter(t => t.soundType === 'piano')).toFixed(1)) + '%',
          'Experiment_Date': results.startTime.toISOString().split('T')[0],
          'Complete_Results': JSON.stringify(results, null, 2)
        }
      };

      await this.base(this.tableName).create([record]);
      console.log('Results successfully saved to Airtable');
    } catch (error) {
      console.error('Error saving results to Airtable:', error);
      throw new Error(`Failed to save to Airtable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateAccuracy(trials: any[]): number {
    if (trials.length === 0) return 0;
    return (trials.filter(t => t.isCorrect).length / trials.length) * 100;
  }
}

export { AirtableService, type AirtableConfig };