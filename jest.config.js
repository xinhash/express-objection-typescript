module.exports = {
  globals: {
    __DEV__: true
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@app/(.*)': '<rootDir>/src/$1',
    '@knexfile': '<rootDir>/knexfile.ts'
  }
}
