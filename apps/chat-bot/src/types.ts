export type Token = {
  accessToken: string;
  expiresIn: number | null;
  obtainmentTimestamp: number;
  refreshToken: string | null;
  scope: string[];
};
