import * as dotenv from 'dotenv';
dotenv.config({ override: true });

export const env = {
  baseUrl: (process.env.BASE_URL || '').trim() as string,
  apiUrl: (process.env.API_URL || '').trim() as string,
  username: (process.env.USERNAME || '').trim() as string,
  password: (process.env.PASSWORD || '').trim() as string,
};

if (!env.baseUrl) {
  throw new Error('BASE_URL is not defined in .env');
}

if (!env.username || !env.password) {
  throw new Error('USERNAME or PASSWORD is not defined in .env');
}
