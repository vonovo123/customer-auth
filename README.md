# 본인인증 프론트엔드

[데모 페이지](https://vonovo123.github.io/customer-auth/identity-authentication)

Vite + React + TypeScript 기반의 비대면 대출 본인인증 UI입니다.

## 로컬 실행

```bash
cp .env.example .env.development
npm install
npm run dev
```

개발 서버는 `/api` 경로를 `VITE_API_BASE_URL`(기본: `https://interview.honestfund.kr`)로 프록시합니다.  
별도 CORS 프록시 없이 로컬에서 API를 호출할 수 있습니다.

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `VITE_API_BASE_URL` | API origin (trailing slash 없음) |
| `VITE_CORS_PROXY_URL` | 프로덕션 CORS 프록시 origin. 로컬에서는 비워 둠 |

프로덕션(GitHub Pages)은 정적 호스팅이라 브라우저 CORS를 우회하려면 프록시가 필요합니다.  
[`workers/cors-proxy.js`](workers/cors-proxy.js)를 Cloudflare Workers에 배포한 뒤 Worker URL을 `VITE_CORS_PROXY_URL`에 넣으면 됩니다.

## 빌드

```bash
npm run build
```

결과물은 `dist/`에 생성되며, SPA 새로고침을 위해 `404.html`이 `index.html`과 동일하게 복사됩니다.

## 배포

`master` 브랜치 push 시 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)이 `dist`를 `gh-pages` 브랜치로 배포합니다.

GitHub 저장소 Settings → Secrets and variables에서 다음을 설정하세요.

- **Secret** `VITE_CORS_PROXY_URL`: Cloudflare Worker URL
- **Variable**(선택) `VITE_API_BASE_URL`: 기본값 외 API를 쓸 때만

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
