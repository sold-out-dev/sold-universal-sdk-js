# Universal SDK — TypeScript / JavaScript

TypeScript/JavaScript SDK for **Akamai Bot Manager**: sensor data generation, pixel and SBSD challenges, sec-cpt solving and `_abck` cookie validation.

## 🔑 Getting API Access

Before using this SDK you need an API key:

1. Go to [sold-out.dev](https://sold-out.dev/), create an account and link your API key.
2. You can even ask for a **free trial** on our [Discord](https://discord.gg/NMRfsunxZ4).

## 📦 Installation

```bash
npm install sold-universal-sdk-js
```

## 🔧 Basic Usage

```typescript
import { Session, SensorInput, generateSensorData } from 'sold-universal-sdk-js';

const session = new Session("your-api-key");

const result = await generateSensorData(session, new SensorInput(
    // sensor input fields
));
```

### Session options

```typescript
import { Session, CompressionType } from 'sold-universal-sdk-js';

const session = new Session("your-api-key", {
    compression: CompressionType.Gzip,
    timeout: 30000,
    proxy: "http://user:pass@proxy.example.com:8080",
    rejectUnauthorized: true,
});
```

For drop-in compatibility with the upstream SDK, the legacy call shape
`new Session(apiKey, jwtKey, appKey, appSecret, options)` is still accepted — the credential
arguments are ignored, since this API authenticates with the API key alone.

### Custom base URL

The API base url defaults to `DEFAULT_BASE_URL` (`https://sold-out.dev`). Override it via the `baseUrl` session option:

```typescript
import { Session, DEFAULT_BASE_URL } from 'sold-universal-sdk-js';

const session = new Session("your-api-key", {
    baseUrl: "https://akamai.example.com", // trailing slashes are stripped
});

console.log(session.baseUrl, DEFAULT_BASE_URL);
```

## 🛡️ Akamai Bot Manager

### Generating Sensor Data

```typescript
import { SensorInput, generateSensorData } from 'sold-universal-sdk-js';

const result = await generateSensorData(session, new SensorInput(
    // sensor input fields
));
```

### Parsing Script Path

```typescript
import { parseAkamaiPath } from 'sold-universal-sdk-js';

const scriptPath = parseAkamaiPath(htmlContent);
```


### Handling Sec-Cpt Challenges

```typescript
import { parseChallengeHTML, parseChallengeJSON } from 'sold-universal-sdk-js';

const challenge = parseChallengeHTML(htmlContent);
// or: const challenge = parseChallengeJSON(jsonResponse);

if (challenge?.cryptoChallenge) {
    const payload = challenge.cryptoChallenge.generatePayload(secCptCookie);
}

await challenge?.wait();
```

### Cookie Validation

```typescript
import { isAkamaiCookieValid, isAkamaiCookieInvalidated } from 'sold-universal-sdk-js';

const isValid = isAkamaiCookieValid(cookieValue, requestCount);
const needsRefresh = isAkamaiCookieInvalidated(cookieValue);
```


### Pixel Challenge Solving

```typescript
import {
    PixelInput,
    generatePixelData,
    parsePixelHtmlVar,
    parsePixelScriptUrl,
    parsePixelScriptVar
} from 'sold-universal-sdk-js';

const htmlVar = parsePixelHtmlVar(htmlContent);
const scriptUrls = parsePixelScriptUrl(htmlContent);
const scriptVar = parsePixelScriptVar(scriptContent);

const pixelData = await generatePixelData(session, new PixelInput(
    // pixel input fields
));
```

### SBSD Challenge Solving

```typescript
import { SbsdInput, generateSbsdPayload } from 'sold-universal-sdk-js';

const sbsdData = await generateSbsdPayload(session, new SbsdInput(
    // sbsd input fields
));
```

## 📄 License

MIT — see [LICENSE](LICENSE).

---

Fork of the Hyper Solutions SDK, trimmed down to the Akamai part and pointed at our own API.
