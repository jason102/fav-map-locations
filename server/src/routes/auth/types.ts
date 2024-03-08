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
  userId: string;
  username: string;
  email: string;
};
