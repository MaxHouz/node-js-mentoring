module.exports = {
    "testMatch": [
        "**/?(*.)+(test).+(ts|js)"
    ],
    "transform": {
        "^.+\\.(ts)$": "ts-jest"
    },
    "globalSetup": './src/tests/setup.ts',
    "globalTeardown": './src/tests/teardown.ts'
}

