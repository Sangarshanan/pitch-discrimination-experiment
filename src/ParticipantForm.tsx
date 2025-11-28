import React, { useState } from 'react';
// Make sure to import the new types
import type { ParticipantInfo, SingingInTuneAbility, SingingFrequency } from './types';
import { MusicalAbilityLevels, SingingAbilityLevels, SingingInTuneAbilityLevels, SingingFrequencyLevels,  PrimaryListeningTypeLevels } from './types';

interface ParticipantFormProps {
  onSubmit: (info: ParticipantInfo) => void;
}

const RadioGroup = ({ name, options, selected, onChange }: { name: string, options: readonly string[], selected: string | undefined, onChange: React.ChangeEventHandler<HTMLInputElement> }) => (
    <div className="radio-group">
        {options.map(option => (
            <label key={option} className="radio-option">
                <input
                    type="radio"
                    name={name}
                    value={option}
                    checked={selected === option}
                    onChange={onChange}
                    className="radio-input"
                />
                <span className="radio-label">{option}</span>
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

  const isFormValid = () => {
    return (
      formData.hasConsented &&
      formData.name.trim() !== '' &&
      formData.age !== undefined &&
      formData.gender !== '' &&
      formData.nativeLanguage.trim() !== '' &&
      formData.isTonalLanguage !== undefined &&
      formData.hasHearingIssues !== undefined &&
      formData.yearsMusicalExperience !== undefined &&
      formData.yearsInstrumentTraining !== undefined &&
      formData.trainingStartAge !== undefined &&
      formData.instrument.trim() !== '' &&
      formData.MusicalAbility !== undefined &&
      formData.musicListeningHours !== undefined &&
      formData.primaryListeningType !== undefined &&
      formData.musicGenres.trim() !== '' &&
      formData.yearsVocalTraining !== undefined &&
      formData.singingInTuneAbility !== undefined &&
      formData.singingFrequency !== undefined &&
      formData.singingAbility !== undefined &&
      formData.hasPerfectPitch !== undefined
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    } else {
      alert('Please fill out all required fields before submitting.');
    }
  };

  return (
    <div className="app">
      <div className="form-container">
        <h1>Pitch Discrimination Experiment</h1>
        <p>
          This experiment measures how good you are at detecting tiny differences in pitch.
          You'll hear three sounds in a row - two identical and one different.
          Your job is to identify which one is the odd one out!
        </p>
        <p style={{fontWeight: 'bold', color: '#d9534f'}}>
          All fields marked with <span style={{color: 'red'}}>*</span> are required.
        </p>

        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Consent Form and Instructions</legend>
            <p>Purpose: We are studying how our brain processes pitch information in different types of musical sounds. You will listen to pairs of short sounds and answer questions about what you hear.
What you will do:
<ul>
<li>Answer a questionnaire about your background and listening experiences</li>
<li>Make sure you are in a quiet environment and use headphones</li>
</ul>
</p>
<p>
Data Privacy:
<ul>
<li>Your data will be completely anonymized for analysis</li>
<li>Your personal information will not be shared with any person or company outside our research team</li>
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
                  <label>Name: <span style={{color: 'red'}}>*</span></label>
                  <input type="string" name="name" value={formData.name ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Age: <span style={{color: 'red'}}>*</span></label>
                  <input type="number" name="age" value={formData.age ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender: <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="gender" options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} selected={formData.gender} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>What is your native language? <span style={{color: 'red'}}>*</span></label>
                  <input type="text" name="nativeLanguage" value={formData.nativeLanguage || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Is your native language a tonal language (e.g., Mandarin, Cantonese, Thai, Vietnamese)? <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="isTonalLanguage" options={['Yes', 'No', "I don't know"]} selected={formData.isTonalLanguage} onChange={handleChange} />
                </div>
              </fieldset>

              {/* --- HEARING HEALTH --- */}
              <fieldset>
                <legend>Hearing Health</legend>
                <div className="form-group">
                  <label>Do you have any hearing issues or hearing loss? <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="hasHearingIssues" options={['Yes', 'No']} selected={formData.hasHearingIssues} onChange={handleChange} />
                </div>
                {formData.hasHearingIssues === 'Yes' && (
                  <div className="form-group">
                    <label>Please describe your hearing issues:</label>
                    <textarea name="hearingIssuesDescription" value={formData.hearingIssuesDescription} onChange={handleChange} placeholder="Please provide details about your hearing issues..." />
                  </div>
                )}
              </fieldset>

              {/* --- MUSICAL EXPERIENCE --- */}
              <fieldset>
                <legend>Musical Experience</legend>
                <div className="form-group">
                  <label>Years of musical training on any instrument (can be 0): <span style={{color: 'red'}}>*</span></label>
                  <input type="number" name="yearsMusicalExperience" value={formData.yearsMusicalExperience ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Years of formal training on your primary instrument: <span style={{color: 'red'}}>*</span></label>
                  <input type="number" name="yearsInstrumentTraining" value={formData.yearsInstrumentTraining ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Age you began musical training: <span style={{color: 'red'}}>*</span></label>
                  <input type="number" name="trainingStartAge" value={formData.trainingStartAge ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Primary Instrument: <span style={{color: 'red'}}>*</span></label>
                  <input type="text" name="instrument" value={formData.instrument || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Overall Musical Ability: <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="MusicalAbility" options={MusicalAbilityLevels} selected={formData.MusicalAbility} onChange={handleChange} />
                </div>
              </fieldset>

              {/* --- MUSICAL LISTENING --- */}
              <fieldset>
                <legend>Musical Listening</legend>
                <div className="form-group">
                  <label>How many hours a week, on average, do you listen to music? <span style={{color: 'red'}}>*</span></label>
                  <input type="number" name="musicListeningHours" value={formData.musicListeningHours ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                <label>Do you primarily listen to instrumental music or music with vocals? <span style={{color: 'red'}}>*</span></label>
                <RadioGroup name="primaryListeningType" options={PrimaryListeningTypeLevels} selected={formData.primaryListeningType} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>What genres of music do you most frequently listen to? <span style={{color: 'red'}}>*</span></label>
                  <textarea name="musicGenres" value={formData.musicGenres} onChange={handleChange} placeholder="e.g., Pop, Rock, Classical, Jazz..." required />
                </div>
              </fieldset>

              {/* --- SINGING EXPERIENCE --- */}
              <fieldset>
                <legend>Singing Experience</legend>
                <div className="form-group">
                  <label>How many years of formal vocal training have you had?(Can be 0) <span style={{color: 'red'}}>*</span></label>
                  <input type="number" name="yearsVocalTraining" value={formData.yearsVocalTraining ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>How would you rate your ability to sing in tune? <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="singingInTuneAbility" options={SingingInTuneAbilityLevels} selected={formData.singingInTuneAbility} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>How often do you sing (including casually)? <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="singingFrequency" options={SingingFrequencyLevels} selected={formData.singingFrequency} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Overall Singing Ability: <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="singingAbility" options={SingingAbilityLevels} selected={formData.singingAbility} onChange={handleChange} />
                </div>
              </fieldset>

              {/* --- AUDITORY ABILITIES --- */}
              <fieldset>
                <legend>Auditory Abilities</legend>
                <div className="form-group">
                  <label>Do you have perfect pitch (the ability to identify or reproduce specific musical notes without a reference)? <span style={{color: 'red'}}>*</span></label>
                  <RadioGroup name="hasPerfectPitch" options={['Yes', 'No', "I'm not sure"]} selected={formData.hasPerfectPitch} onChange={handleChange} />
                </div>
              </fieldset>

              <button type="submit" className="btn">Start Experiment</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;
