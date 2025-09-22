const geminiProvider = process.env.GEMINI_API_KEY ? require('./providers/geminiProvider') : null;
const openaiProvider = process.env.OPENAI_API_KEY ? require('./providers/openaiProvider') : null;

const providers = new Map();
let defaultProvider = null;

if (geminiProvider) {
  providers.set('gemini', geminiProvider);
  defaultProvider = defaultProvider || geminiProvider;
}

if (openaiProvider) {
  providers.set('openai', openaiProvider);
  defaultProvider = defaultProvider || openaiProvider;
}

if (!defaultProvider) {
  throw new Error('No AI providers configured. Please set GEMINI_API_KEY or OPENAI_API_KEY');
}

const getAvailableProvider = async (preferredProvider = null) => {
  if (preferredProvider && providers.has(preferredProvider)) {
    const provider = providers.get(preferredProvider);
    if (await provider.isAvailable()) return provider;
  }
  if (defaultProvider && await defaultProvider.isAvailable()) return defaultProvider;
  for (const [name, provider] of providers) {
    if (await provider.isAvailable()) {
      console.log(`Using fallback provider: ${name}`);
      return provider;
    }
  }
  throw new Error('No AI providers are currently available');
};

const generateInitialQuestion = async (jobDetails, resumeText, preferredProvider = null) => {
  const provider = await getAvailableProvider(preferredProvider);
  return await provider.generateInitialQuestion(jobDetails, resumeText);
};

const generateFollowUpQuestion = async (transcriptHistory, jobDetails, preferredProvider = null) => {
  const provider = await getAvailableProvider(preferredProvider);
  return await provider.generateFollowUpQuestion(transcriptHistory, jobDetails);
};

const analyzeInterviewTranscript = async (transcript, jobDetails, preferredProvider = null) => {
  const provider = await getAvailableProvider(preferredProvider);
  return await provider.analyzeInterviewTranscript(transcript, jobDetails);
};

const getAvailableProviders = () => Array.from(providers.keys());

const getProviderStatus = async () => {
  const status = {};
  for (const [name, provider] of providers) {
    status[name] = { available: await provider.isAvailable(), name: provider.getProviderName() };
  }
  return status;
};

module.exports = {
  generateInitialQuestion,
  generateFollowUpQuestion,
  analyzeInterviewTranscript,
  getAvailableProviders,
  getProviderStatus,
};
