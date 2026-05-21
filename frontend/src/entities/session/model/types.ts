export type LoginFormState = {
  username: string;
  password: string;
};

export type AdminUser = {
  username: string;
  role: string;
};

export type AdminSession = {
  access_token: string;
  token_type: string;
  user: AdminUser;
};
