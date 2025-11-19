// src/types.ts
export const MusicalAbilityLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
export const SingingAbilityLevels = ['Untrained', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
export const SightReadingAbilityLevels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'] as const;
export const SingingInTuneAbilityLevels = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'] as const;
export const SingingFrequencyLevels = ['Daily', 'A few times a week', 'Weekly', 'Monthly', 'Rarely or never'] as const;
export const PrimaryListeningTypeLevels = ['Primarily Instrumental', 'Primarily Vocal', 'A mix of both'] as const;


export type MusicalAbility = typeof MusicalAbilityLevels[number];
export type SingingAbility = typeof SingingAbilityLevels[number];
export type SingingInTuneAbility = typeof SingingInTuneAbilityLevels[number];
export type SingingFrequency = typeof SingingFrequencyLevels[number];

export type PrimaryListeningType = typeof PrimaryListeningTypeLevels[number];



export interface ParticipantInfo {

  // Consent
  hasConsented: boolean;

  // Demographic Information
  name: string;
  age: number | undefined;
  gender: string;
  nativeLanguage: string;
  isTonalLanguage: string | undefined;

  // Hearing Health
  hasHearingIssues: string | undefined;
  hearingIssuesDescription: string;

  // Musical Experience
  yearsMusicalExperience: number | undefined;
  yearsInstrumentTraining: number | undefined;
  trainingStartAge: number | undefined;
  instrument: string;
  MusicalAbility: MusicalAbility | undefined,

  // Musical Listening
  musicListeningHours: number | undefined;
  primaryListeningType: PrimaryListeningType | undefined;
  musicGenres: string;

  // Singing Experience
  yearsVocalTraining: number | undefined;
  singingInTuneAbility: SingingInTuneAbility | undefined;
  singingFrequency: SingingFrequency | undefined;
  singingAbility: SingingAbility | undefined;
  // Auditory Abilities
  hasPerfectPitch: string | undefined;
}

export interface AudioTriplet {
  sounds: {
    frequency: number;
    isDifferent: boolean;
  }[];
  correctPosition: number;
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
  responseTime: number; // in milliseconds
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
