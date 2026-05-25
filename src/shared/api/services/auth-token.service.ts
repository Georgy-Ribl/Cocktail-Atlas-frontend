import Cookies from 'js-cookie';
import { ENUM_TOKENS } from '@/shared/api/constants/tokens';

export const getAccessToken = () => {
  const accessToken = Cookies.get(ENUM_TOKENS.ACCESS_TOKEN);

  return accessToken || null;
};

export const saveTokenStorage = (accessToken: string) => {
  Cookies.set(ENUM_TOKENS.ACCESS_TOKEN, accessToken, {
    sameSite: 'lax',
    expires: 30,
  });
};

export const removeFromStorage = () => {
  Cookies.remove(ENUM_TOKENS.ACCESS_TOKEN);
};
