export const EXPERIMENT_CONFIG = {
  // Number of trials in the experiment
  TOTAL_TRIALS: 10,

  AIRTABLE: {
    // This can access only one specific base and has restricted permissions
    API_KEY: 'patPbraHvUjuW5dqZ.d1af532e830d99eb37fa0989df5c3a691b8c7c77cd8a968b5608d67bd7b6d594',
    BASE_ID: 'appjTSpCcgpJKjtzb',
    TABLE_NAME: 'tblN0TIUfC2icXNdU'
  }
};

export const getTrialCount = () => EXPERIMENT_CONFIG.TOTAL_TRIALS;

export const getAirtableConfig = () => {
  const { API_KEY, BASE_ID, TABLE_NAME } = EXPERIMENT_CONFIG.AIRTABLE;

  if (!API_KEY || !BASE_ID) {
    console.warn('Airtable configuration is incomplete. Results will only be available for download.');
    return null;
  }

  return {
    apiKey: API_KEY,
    baseId: BASE_ID,
    tableName: TABLE_NAME
  };
};
