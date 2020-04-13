module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts',
    'e2e/**/*.ts',
    '!src/**/*.d.ts',
    '!src/database/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  maxWorkers: 1,
  moduleDirectories: ['node_modules', 'src', 'e2e'],
  moduleFileExtensions: ['js', 'ts'],
  restoreMocks: true,
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.int-spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};
