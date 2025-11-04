# AngusAI TypeScript SDK

## 生成SDK

```bash
# 进入应用目录
cd AngusAI/web

# 生成SDK
npx @hey-api/openapi-ts \
  # -i http://192.168.3.7:1530/v3/api-docs/user \
  -i http://192.168.3.7:1530/v3/api-docs/user \
  -o src/api \
  -c @hey-api/client-axios
```

## 查看帮助

https://heyapi.dev/openapi-ts/clients/axios
