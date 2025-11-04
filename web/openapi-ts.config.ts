export default {
    // path: 'http://192.168.3.7:1530/v3/api-docs/user',
    input: '../docs/AngusAI-Apis-V1.json',
    output: {
        format: 'prettier',
        path: 'src/api',
        lint: 'eslint',
        fileName: {
            suffix: null,
        },
    },
    parser: {
        transforms: {
            enums: 'root',
        }
    },
    plugins: [
        // ...other plugins
        '@hey-api/client-axios',
        {
            enums: 'typescript',
            name: '@hey-api/typescript',
        },
        {
            asClass: true,
            name: '@hey-api/sdk',
        },
    ],
}