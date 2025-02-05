// src/types/passwords.ts
export interface PasswordEntry {  
    _id: string;
    site: string;
    username: string;
    passwordEncrypted: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
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
      passwords: PasswordEntry[];
      encryption_key: string;
      createdAt: string;
      updatedAt: string;
    };
  }