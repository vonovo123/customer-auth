import type {
  ApiSuccessResponse,
  CertificationEndpoint,
  RequestPayload,
  SubmitPayload,
} from '../types/api';

function buildApiUrl(type: CertificationEndpoint): string {
  const path = `/tech/frontend/personal/${type}`;

  if (import.meta.env.DEV) {
    return `/api${path}`;
  }

  const corsProxy = (import.meta.env.VITE_CORS_PROXY_URL ?? '').replace(
    /\/$/,
    ''
  );
  const apiBase = (
    import.meta.env.VITE_API_BASE_URL || 'https://interview.honestfund.kr'
  ).replace(/\/$/, '');

  if (!corsProxy) {
    return `${apiBase}${path}`;
  }

  return `${corsProxy}/${apiBase}${path}`;
}

export async function fetchCertification(
  type: 'request',
  payload: RequestPayload
): Promise<ApiSuccessResponse>;
export async function fetchCertification(
  type: 'submit',
  payload: SubmitPayload
): Promise<ApiSuccessResponse>;
export async function fetchCertification(
  type: CertificationEndpoint,
  payload: RequestPayload | SubmitPayload
): Promise<ApiSuccessResponse> {
  const result = await fetch(buildApiUrl(type), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    let message = 'API 조회 오류입니다. 다시 시도해주세요.';
    try {
      const data = (await result.json()) as { error?: string };
      if (data.error) {
        message = data.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return result.json() as Promise<ApiSuccessResponse>;
}
