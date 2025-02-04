export interface LoginSuccessMessage {
    type: 'LOGIN_SUCCESS';
    token: string;
  }
  
  export interface AuthChangedMessage {
    type: 'AUTH_CHANGED';
    token: string;
  }
  
  export type ExtensionMessage = LoginSuccessMessage | AuthChangedMessage;