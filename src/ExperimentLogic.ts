import { AudioTriplet, TrialResult } from './types';
import { getTrialCount } from './config';

export class ExperimentLogic {
  private voiceCurrentDifference: number = 6;
  private pianoCurrentDifference: number = 4;
  private voiceConsecutiveCorrect: number = 0;
  private pianoConsecutiveCorrect: number = 0;

  private readonly availableFrequencies = [128, 129, 130, 131, 132, 133, 134, 135, 136, 137];
  private readonly minDifference = 1;
  private readonly maxDifference = 6;

  generateTriplet(soundType: 'voice' | 'piano'): AudioTriplet {
    const currentDifference = soundType === 'voice' ? this.voiceCurrentDifference : this.pianoCurrentDifference;

    const minFreq = this.availableFrequencies[0]; // 128
    const maxFreq = this.availableFrequencies[this.availableFrequencies.length - 1]; // 137

    // Use minimum frequency as base and go higher to use full range
    const baseFrequency = minFreq; // Always start at 128
    const higherFrequency = baseFrequency + currentDifference;

    // Ensure higher frequency is within range
    const differentFrequency = Math.min(higherFrequency, maxFreq);

    const correctPosition = Math.floor(Math.random() * 3);

    const sounds = [
      { frequency: baseFrequency, isDifferent: false },
      { frequency: baseFrequency, isDifferent: false },
      { frequency: baseFrequency, isDifferent: false }
    ];

    sounds[correctPosition] = { frequency: differentFrequency, isDifferent: true };

    return {
      sounds,
      correctPosition
    };
  }

  private getRandomBaseFrequency(difference: number): number {
    const minFreq = this.availableFrequencies[0];
    const maxFreq = this.availableFrequencies[this.availableFrequencies.length - 1];

    // Base frequency must allow for both higher and lower frequencies within range
    const minBase = minFreq + difference;
    const maxBase = maxFreq - difference;

    const validFrequencies = this.availableFrequencies.filter(
      freq => freq >= minBase && freq <= maxBase
    );

    if (validFrequencies.length === 0) {
      // Fallback: use middle frequency if no valid base exists
      return this.availableFrequencies[Math.floor(this.availableFrequencies.length / 2)];
    }

    return validFrequencies[Math.floor(Math.random() * validFrequencies.length)];
  }

  processResponse(
    isCorrect: boolean,
    soundType: 'voice' | 'piano',
    trialResult: Omit<TrialResult, 'isCorrect'>
  ): TrialResult {
    this.updateAdaptiveAlgorithm(isCorrect, soundType);

    return {
      ...trialResult,
      isCorrect
    };
  }

  private updateAdaptiveAlgorithm(isCorrect: boolean, soundType: 'voice' | 'piano') {
    if (soundType === 'voice') {
      if (isCorrect) {
        this.voiceConsecutiveCorrect++;

        // Reduce difficulty by 1 Hz after 2 consecutive correct answers
        if (this.voiceConsecutiveCorrect >= 2) {
          this.voiceCurrentDifference = Math.max(
            this.minDifference,
            this.voiceCurrentDifference - 1
          );
          this.voiceConsecutiveCorrect = 0;
        }
      } else {
        // Wrong answer: stay at same difficulty level, reset correct counter
        this.voiceConsecutiveCorrect = 0;
      }
    } else {
      if (isCorrect) {
        this.pianoConsecutiveCorrect++;

        // Reduce difficulty by 1 Hz after 2 consecutive correct answers
        if (this.pianoConsecutiveCorrect >= 2) {
          this.pianoCurrentDifference = Math.max(
            this.minDifference,
            this.pianoCurrentDifference - 1
          );
          this.pianoConsecutiveCorrect = 0;
        }
      } else {
        // Wrong answer: stay at same difficulty level, reset correct counter
        this.pianoConsecutiveCorrect = 0;
      }
    }
  }

  getCurrentThreshold(soundType: 'voice' | 'piano'): number {
    return soundType === 'voice' ? this.voiceCurrentDifference : this.pianoCurrentDifference;
  }

  getVoiceThreshold(): number {
    return this.voiceCurrentDifference;
  }

  getPianoThreshold(): number {
    return this.pianoCurrentDifference;
  }

  generateTrialSequence(): ('voice' | 'piano')[] {
    const totalTrials = getTrialCount();
    const voiceTrialsCount = Math.ceil(totalTrials / 2);
    const pianoTrialsCount = Math.floor(totalTrials / 2);

    const voiceTrials = Array(voiceTrialsCount).fill('voice');
    const pianoTrials = Array(pianoTrialsCount).fill('piano');

    const allTrials = [...voiceTrials, ...pianoTrials];

    // Fisher-Yates shuffle
    for (let i = allTrials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTrials[i], allTrials[j]] = [allTrials[j], allTrials[i]];
    }

    return allTrials as ('voice' | 'piano')[];
  }
}