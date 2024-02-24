export const getGoogleUserDetails = async (accessToken) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();
    if (data.error || !data) {
      return;
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
