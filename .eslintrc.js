module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 6,
    },
    overrides: [
        {
            files: [
                '**/*.ts',
                '**/*.tsx',
            ],
            plugins: [
                '@typescript-eslint',
            ],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            parserOptions: {
                project: 'tsconfig.json',
            },
        },
    ],
}
