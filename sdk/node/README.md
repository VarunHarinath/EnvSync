# @envsync/node
```js
import { EnvSync } from "@envsync/node";
const envsync = new EnvSync({ apiKey: process.env.ENVSYNC_API_KEY, baseUrl: "https://envsync.acme.internal", cacheTtl: 30_000 });
const databaseUrl = await envsync.get("DATABASE_URL");
```
API keys are sent only in the Authorization header and never logged by the SDK.
