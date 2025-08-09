import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";

// GET NEW ACCESS TOKEN
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  getNewAccessToken,
};
