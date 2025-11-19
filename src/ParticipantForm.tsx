import React, { useState } from 'react';
import { ParticipantInfo } from './types';

interface ParticipantFormProps {
  onSubmit: (info: ParticipantInfo) => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ParticipantInfo>({
    name: '',
    age: undefined,
    yearsMusicalExperience: undefined,
    instrument: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ParticipantInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'age' || field === 'yearsMusicalExperience'
        ? value === '' ? undefined : parseInt(value)
        : value
    }));
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
        <p>
          The test is dynamic and will adapt to your ability
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name (required):</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age (optional):</label>
            <input
              type="number"
              id="age"
              value={formData.age || ''}
              onChange={handleChange('age')}
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of Musical Experience (optional):</label>
            <input
              type="number"
              id="experience"
              value={formData.yearsMusicalExperience || ''}
              onChange={handleChange('yearsMusicalExperience')}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="instrument">Primary Instrument (optional):</label>
            <input
              type="text"
              id="instrument"
              value={formData.instrument || ''}
              onChange={handleChange('instrument')}
              placeholder="e.g., Piano, Guitar, Violin, Voice"
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={!formData.name.trim()}
          >
            Start Experiment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;