export const LOGIN_URL = "https://login.linode.com/oauth/authorize";

export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID ?? "1228ce081a630e7919ef";

export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL ?? `http://localhost:5173/callback`;

export const SCOPE = "*";

export const RESPONSE_TYPE = "token";