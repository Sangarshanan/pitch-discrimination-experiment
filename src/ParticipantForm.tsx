// src/components/ParticipantForm.tsx

import React, { useState } from 'react';
// Make sure to import the new types
import type { ParticipantInfo, SingingInTuneAbility, SingingFrequency } from './types';
import { MusicalAbilityLevels, SingingAbilityLevels, SingingInTuneAbilityLevels, SingingFrequencyLevels,  PrimaryListeningTypeLevels } from './types';

interface ParticipantFormProps {
  onSubmit: (info: ParticipantInfo) => void;
}

// A small helper component to make creating radio button groups easier
const RadioGroup = ({ name, options, selected, onChange }: { name: string, options: readonly string[], selected: string | undefined, onChange: React.ChangeEventHandler<HTMLInputElement> }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
        {options.map(option => (
            <label key={option}>
                <input type="radio" name={name} value={option} checked={selected === option} onChange={onChange} />
                {option}
            </label>
        ))}
    </div>
);

const ParticipantForm: React.FC<ParticipantFormProps> = ({ onSubmit }) => {
  // Initialize the state with all the new fields from our types.ts file
  const [formData, setFormData] = useState<ParticipantInfo>({
    name: '',
    age: undefined,
    gender: '',
    nativeLanguage: '',
    isTonalLanguage: undefined,
    hasConsented: false,
    hasHearingIssues: undefined,
    hearingIssuesDescription: '',
    yearsMusicalExperience: undefined,
    yearsInstrumentTraining: undefined, // NEW
    trainingStartAge: undefined, // NEW
    instrument: '',
    MusicalAbility: undefined,// NEW
    musicListeningHours: undefined,
    primaryListeningType: undefined, // NEW
    musicGenres: '', // NEW
    yearsVocalTraining: undefined, // NEW
    singingInTuneAbility: undefined, // NEW
    singingFrequency: undefined, // NEW
    singingAbility: undefined,
    hasPerfectPitch: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseInt(value, 10) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.hasConsented) {
      onSubmit(formData);
    }
  };

  return (
    <div className="app">
      <div className="form-container">
        <h1>Pitch Discrimination Experiment</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Consent Form and Instructions</legend>
            <p>Purpose: We are studying how our brain processes pitch information in different types of musical sounds. You will listen to pairs of short sounds and answer questions about what you hear.
What you will do:
<ul>
<li>Answer a questionnaire about your background and listening experiences</li>
<li>Complete a brief hearing screening to ensure typical hearing levels</li>
<li>Listen to pairs of short musical sounds (piano and voice)</li>
<li>Indicate whether the sounds are the same or different in pitch</li>
</ul>
</p>
<p>
Important information:
<ul>
<li>There are no right or wrong answers</li>
<li>You are not being ranked or judged based on your performance</li>
<li>The task will take approximately 20-30 minutes</li>
<li>Your data will be completely anonymized for analysis</li>
<li>Your personal information will not be shared with any person or company outside our research team</li>
<li>You may withdraw from the study at any time without penalty</li>
</ul>
</p>
            <div className="form-group">
              <label>
                <input type="checkbox" name="hasConsented" checked={formData.hasConsented} onChange={handleChange} />
                <b>Yes, I consent to participate.</b>
              </label>
            </div>
          </fieldset>

          {formData.hasConsented && (
            <>
              {/* --- DEMOGRAPHIC INFORMATION --- */}
              <fieldset>
                <legend>Demographic Information</legend>
                <div className="form-group">
                  <label>Name:</label>
                  <input type="string" name="name" value={formData.name ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Age:</label>
                  <input type="number" name="age" value={formData.age ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Gender:</label>
                  <RadioGroup name="gender" options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} selected={formData.gender} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>What is your native language?</label>
                  <input type="text" name="nativeLanguage" value={formData.nativeLanguage || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Is your native language a tonal language (e.g., Mandarin, Cantonese, Thai, Vietnamese)?</label>
                  <RadioGroup name="isTonalLanguage" options={['Yes', 'No', "I don't know"]} selected={formData.isTonalLanguage} onChange={handleChange} />
                </div>
              </fieldset>

              {/* --- MUSICAL EXPERIENCE --- */}
              <fieldset>
                <legend>Musical Experience</legend>
                <div className="form-group">
                  <label>Years of musical training on any instrument (can be 0):</label>
                  <input type="number" name="yearsMusicalExperience" value={formData.yearsMusicalExperience ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Years of formal training on your primary instrument:</label>
                  <input type="number" name="yearsInstrumentTraining" value={formData.yearsInstrumentTraining ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Age you began musical training:</label>
                  <input type="number" name="trainingStartAge" value={formData.trainingStartAge ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Primary Instrument:</label>
                  <input type="text" name="instrument" value={formData.instrument || ''} onChange={handleChange} />
                </div>
              </fieldset>

              {/* --- MUSICAL LISTENING --- */}
              <fieldset>
                <legend>Musical Listening</legend>
                <div className="form-group">
                  <label>How many hours a week, on average, do you listen to music?</label>
                  <input type="number" name="musicListeningHours" value={formData.musicListeningHours ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                <label>Do you primarily listen to instrumental music or music with vocals?</label>
                <RadioGroup name="primaryListeningType" options={PrimaryListeningTypeLevels} selected={formData.primaryListeningType} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>What genres of music do you most frequently listen to?</label>
                  <textarea name="musicGenres" value={formData.musicGenres} onChange={handleChange} placeholder="e.g., Pop, Rock, Classical, Jazz..." />
                </div>
              </fieldset>

              {/* --- SINGING EXPERIENCE --- */}
              <fieldset>
                <legend>Singing Experience</legend>
                <div className="form-group">
                  <label>How many years of formal vocal training have you had?(Can be 0)</label>
                  <input type="number" name="yearsVocalTraining" value={formData.yearsVocalTraining ?? ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>How would you rate your ability to sing in tune?</label>
                  <RadioGroup name="singingInTuneAbility" options={SingingInTuneAbilityLevels} selected={formData.singingInTuneAbility} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>How often do you sing (including casually)?</label>
                  <RadioGroup name="singingFrequency" options={SingingFrequencyLevels} selected={formData.singingFrequency} onChange={handleChange} />
                </div>
              </fieldset>
              
              {/* Other sections like Hearing Health and Auditory Abilities would go here */}

              <button type="submit" className="btn">Start Experiment</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;
