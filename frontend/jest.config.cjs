// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const baseConfig = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
}

module.exports = async () => {
  const nextConfig = await createJestConfig(baseConfig)()

  return {
    ...nextConfig,
    projects: [
      {
        ...nextConfig,
        displayName: 'ui',
        testEnvironment: 'jsdom',
        testMatch: ['<rootDir>/test/setup/__tests__/ui/**/*.test.(ts|tsx)'],
        setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.ui.ts'],
      },
      {
        ...nextConfig,
        displayName: 'api',
        testEnvironment: 'node',
        testMatch: ['<rootDir>/test/setup/__tests__/api/**/*.test.(ts|tsx)'],
        setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.api.ts'],
      },
    ],
  }
}
