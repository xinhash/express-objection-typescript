module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@app/(.*)': '<rootDir>/app/$1',
    '@knexfile': '<rootDir>/knexfile.ts'
  }
}
