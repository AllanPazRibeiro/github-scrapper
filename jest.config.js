module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['<rootDir>/**/*.test.ts'],
  automock: true,
  clearMocks: true,
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      lines: 0,
      functions: 0,
    },
  },
  setupFiles: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/application/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@di/(.*)$': '<rootDir>/di/$1',
    '^@domain/(.*)$': '<rootDir>/domain/$1',
    '^@presentation/(.*)$': '<rootDir>/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
}
