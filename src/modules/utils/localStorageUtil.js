import { getSession } from 'next-auth/react';

export const setJwtToken = (token) => {
  if (typeof window !== 'undefined') localStorage.setItem('jwtToken', token);
};

export const getJwtToken = async () => {
  const session = await getSession();
  return session ? session.accessToken : '';
};
