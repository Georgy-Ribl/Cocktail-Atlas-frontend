export interface IAuthForm {
  login: string;
  password: string;
}

export interface ILoginForm extends IAuthForm {
  deviceName: string;
}

export interface IRegisterForm extends IAuthForm {
  displayName: string;
}

export interface IAuthResponse {
  accessToken: string;
}
