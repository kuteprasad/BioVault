export interface BackendPassword {
  _id: string;
  site: string;
  username: string;
  passwordEncrypted: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordEntry extends BackendPassword {}

export interface VaultResponse {
  vault: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      email: string;
      masterPassword: string;
      createdAt: string;
      updatedAt: string;
    };
    passwords: BackendPassword[];
    encryption_key: string;
    createdAt: string;
    updatedAt: string;
  };
}