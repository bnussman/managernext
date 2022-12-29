export const LOGIN_URL = "https://login.linode.com/oauth/authorize";

export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID ?? "1228ce081a630e7919ef";

export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL ?? `http://localhost:5173/callback`;

export const SCOPE = "*";

export const RESPONSE_TYPE = "token";

export const dcDisplayNames: Record<string, string> = {
  'us-east-1': 'Newark, NJ',
  'us-east-1a': 'Newark, NJ',
  'us-south-1a': 'Dallas, TX',
  'us-west-1a': 'Fremont, CA',
  'us-southeast-1a': 'Atlanta, GA',
  'eu-central-1a': 'Frankfurt, DE',
  'eu-west-1a': 'London, UK',
  'ap-northeast-1a': 'Tokyo, JP',
  'ap-northeast-1b': 'Tokyo 2, JP',
  'us-central': 'Dallas, TX',
  'us-west': 'Fremont, CA',
  'us-southeast': 'Atlanta, GA',
  'us-east': 'Newark, NJ',
  'eu-west': 'London, UK',
  'ap-south': 'Singapore, SG',
  'eu-central': 'Frankfurt, DE',
  'ap-northeast': 'Tokyo 2, JP',
  'ca-central': 'Toronto, ON',
  'ca-east': 'Toronto, ON',
  'ap-west': 'Mumbai, IN',
  'ap-southeast': 'Sydney, AU',
};