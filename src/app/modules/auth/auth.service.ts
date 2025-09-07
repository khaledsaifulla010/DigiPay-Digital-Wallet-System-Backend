import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";

export const AuthService = {
  getNewAccessToken: async (refreshToken: string): Promise<string> => {
    return await createNewAccessTokenWithRefreshToken(refreshToken);
  },
};
