
export interface PasswordEntry {
    id: string;
    site: string;
    username: string;
    password: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  }
  
  
  
  export const samplePasswords: PasswordEntry[] = [
    {
      id: "1",
      site: "https://github.com",
      username: "devuser123",
      password: "SecurePass123!",
      notes: "GitHub personal account",
      created_at: new Date("2024-03-15").toISOString(),
      updated_at: new Date("2024-03-15").toISOString(),
    },
    {
      id: "13",
      site: "https://github.com",
      username: "AryaK19",
      password: "SecurePass123!",
      notes: "GitHub personal account",
      created_at: new Date("2024-03-15").toISOString(),
      updated_at: new Date("2024-03-15").toISOString(),
    },
    {
      id: "21",
      site: "https://github.com",
      username: "aadsasd",
      password: "SecurePass123!",
      notes: "GitHub personal account",
      created_at: new Date("2024-03-15").toISOString(),
      updated_at: new Date("2024-03-15").toISOString(),
    },
    {
      id: "2",
      site: "https://circuitverse.org/users/sign_in",
      username: "netflixuser",
      password: "NetflixPass456!",
      notes: "Family Netflix account",
      created_at: new Date("2024-03-14").toISOString(),
      updated_at: new Date("2024-03-14").toISOString(),
    },
    {
      id: "3",
      site: "https://amazon.com",
      username: "shopper789",
      password: "AmazonShop789!",
      notes: "Prime shopping account",
      created_at: new Date("2024-03-13").toISOString(),
      updated_at: new Date("2024-03-13").toISOString(),
    },
  ];
  