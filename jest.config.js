module.exports = {
    preset: 'ts-jest', // Use ts-jest for TypeScript
    testEnvironment: 'jsdom', // For testing browser-based code (use 'node' for server-side tests)
    moduleDirectories: ['node_modules', '<rootDir>/'], // Allows Jest to find modules by absolute imports
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Set up additional configurations (e.g., mocks)
    moduleNameMapper: {
        // Mock CSS and asset imports (like images)
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
        // Handle Next.js absolute imports (e.g., '@/components/...')
        '^@/(.*)$': '<rootDir>/$1',
    },
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], // Ignore build and node_modules
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Transpile TypeScript files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
