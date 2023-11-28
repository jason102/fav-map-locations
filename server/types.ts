export type DatabaseUser = {
  user_id: string;
  username: string;
  email: string;
  hashed_password: string;
  profile_image: string | null;
  last_login: Date;
  created_at: Date;
};

export type PublicUserInfo = {
  username: string;
  email: string;
};

export type LoginFormValues = {
  usernameOrEmail: string;
  password: string;
};

export type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};
