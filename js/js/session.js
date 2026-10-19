export function saveSession(data) {
  const session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    fullName: data.user.user_metadata.full_name,
  };

  localStorage.setItem("pocketwise_session", JSON.stringify(session));
}
