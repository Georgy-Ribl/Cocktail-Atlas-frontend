import { IAuthResponse, type ILoginForm, type IRegisterForm } from '@/shared/api/types';

import { axiosClassic } from '@/shared/api/helpers/set-instances-auth-header';

import { removeFromStorage, saveTokenStorage } from './auth-token.service';
import { AUTH_ROUTES } from '@/shared/api/constants/routes';

export const authService = {
  async login(data: ILoginForm) {
    const response = await axiosClassic.post<IAuthResponse>(AUTH_ROUTES.LOGIN, data, { withCredentials: true });

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

    return response;
  },

  async register(data: IRegisterForm) {
    const response = await axiosClassic.post<IAuthResponse>(AUTH_ROUTES.REGISTER, data, { withCredentials: true });

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

    return response;
  },

  async getNewTokens() {
    const response = await axiosClassic.post<IAuthResponse>(AUTH_ROUTES.GET_NEW_TOKEN, undefined, {
      withCredentials: true,
    });

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

    return response;
  },

  async logout() {
    const response = await axiosClassic.post<boolean>(AUTH_ROUTES.LOGOUT, undefined, { withCredentials: true });

    if (response.data) removeFromStorage();

    return response;
  },
};

export default authService;
