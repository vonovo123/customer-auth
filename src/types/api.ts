export type CertificationEndpoint = 'request' | 'submit';

export interface RequestPayload {
  name: string;
  civilcodeFirst: string;
  civilCodeLast: string;
  mobile: string;
}

export interface SubmitPayload {
  token: string;
  code: string;
}

export interface ApiSuccessResponse {
  response: {
    token?: string;
  };
  error?: string;
}

export type PhoneParts = [string, string, string];
export type CivilCodeParts = [string, string];
