module.exports = {
  maxConcurrency: 1,
  maxWorkers: 1,
  setupFilesAfterEnv: ['dotenv/config', 'jest-extended/all']
}
