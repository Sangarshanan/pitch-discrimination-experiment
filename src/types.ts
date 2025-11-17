export interface ParticipantInfo {
  name: string;
  age?: number;
  yearsMusicalExperience?: number;
  instrument?: string;
}

export interface TrialResult {
  trialNumber: number;
  soundType: 'voice' | 'piano';
  baseFrequency: number;
  differentFrequency: number;
  pitchDifference: number;
  correctPosition: number;
  userResponse: number;
  isCorrect: boolean;
  responseTime: number;
  timestamp: Date;
}

export interface ExperimentResults {
  participant: ParticipantInfo;
  trials: TrialResult[];
  voiceThreshold: number;
  pianoThreshold: number;
  startTime: Date;
  endTime: Date;
}

export interface AudioTriplet {
  sounds: {
    frequency: number;
    isDifferent: boolean;
  }[];
  correctPosition: number;
}