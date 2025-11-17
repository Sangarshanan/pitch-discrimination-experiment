import { AudioTriplet, TrialResult } from './types';

export class ExperimentLogic {
  private voiceCurrentDifference: number = 4;
  private pianoCurrentDifference: number = 4;
  private voiceConsecutiveCorrect: number = 0;
  private pianoConsecutiveCorrect: number = 0;
  private voiceConsecutiveWrong: number = 0;
  private pianoConsecutiveWrong: number = 0;

  private readonly availableFrequencies = [128, 129, 130, 131, 132, 133, 134, 135, 136, 137];
  private readonly minDifference = 1;
  private readonly maxDifference = 9;

  generateTriplet(soundType: 'voice' | 'piano'): AudioTriplet {
    const currentDifference = soundType === 'voice' ? this.voiceCurrentDifference : this.pianoCurrentDifference;

    const baseFrequency = this.getRandomBaseFrequency(currentDifference);
    const higherFrequency = baseFrequency + currentDifference;
    const lowerFrequency = baseFrequency - currentDifference;

    const differentFrequency = Math.random() < 0.5 ? higherFrequency : lowerFrequency;

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
    const minBase = this.availableFrequencies[0] + difference;
    const maxBase = this.availableFrequencies[this.availableFrequencies.length - 1] - difference;

    const validFrequencies = this.availableFrequencies.filter(
      freq => freq >= minBase && freq <= maxBase
    );

    if (validFrequencies.length === 0) {
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
        this.voiceConsecutiveWrong = 0;

        if (this.voiceConsecutiveCorrect >= 2) {
          this.voiceCurrentDifference = Math.max(
            this.minDifference,
            this.voiceCurrentDifference - 1
          );
          this.voiceConsecutiveCorrect = 0;
        }
      } else {
        this.voiceConsecutiveWrong++;
        this.voiceConsecutiveCorrect = 0;

        if (this.voiceConsecutiveWrong >= 2) {
          this.voiceCurrentDifference = Math.min(
            this.maxDifference,
            this.voiceCurrentDifference + 1
          );
          this.voiceConsecutiveWrong = 0;
        }
      }
    } else {
      if (isCorrect) {
        this.pianoConsecutiveCorrect++;
        this.pianoConsecutiveWrong = 0;

        if (this.pianoConsecutiveCorrect >= 2) {
          this.pianoCurrentDifference = Math.max(
            this.minDifference,
            this.pianoCurrentDifference - 1
          );
          this.pianoConsecutiveCorrect = 0;
        }
      } else {
        this.pianoConsecutiveWrong++;
        this.pianoConsecutiveCorrect = 0;

        if (this.pianoConsecutiveWrong >= 2) {
          this.pianoCurrentDifference = Math.min(
            this.maxDifference,
            this.pianoCurrentDifference + 1
          );
          this.pianoConsecutiveWrong = 0;
        }
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
    const sequence: ('voice' | 'piano')[] = [];
    const voiceTrials = Array(15).fill('voice');
    const pianoTrials = Array(15).fill('piano');

    const allTrials = [...voiceTrials, ...pianoTrials];

    for (let i = allTrials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTrials[i], allTrials[j]] = [allTrials[j], allTrials[i]];
    }

    return allTrials as ('voice' | 'piano')[];
  }
}