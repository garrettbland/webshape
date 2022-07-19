module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },

    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.test.ts',
        '!<rootDir>/node_modules/',
        '!<rootDir>/dist/',
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    coverageReporters: ['json', ['lcov', { projectRoot: './src' }], 'text', 'clover'],
    setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
}
