## Script to generate TypeScript SDK from OpenAPI specification using swagger-typescript-api
## Usage: cd AngusAI/web && sh ./scripts/generate-openapi-sdk.sh
## Note: Use v22.9.0+

swagger-typescript-api generate  \
--axios \
--extract-enums \
--http-client="axios" \
--modular \
--single-http-client \
--module-name-index="2" \
--path="../docs/AngusAI-Apis-V1.json" \
 --output="./temp/openapi-sdk"
