import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

export function saveSession(data) {
  const session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    fullName: data.user.user_metadata.full_name,
  };

  localStorage.setItem("pocketwise_session", JSON.stringify(session));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("pocketwise_session"));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("pocketwise_session");
}

// Trade the saved refresh token for a fresh ID card (no password needed)
export async function refreshSession() {
  const session = getSession();
  if (!session) throw new Error("No session to refresh");

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refreshToken }),
    },
  );

  if (!response.ok) throw new Error("Could not refresh session");

  const data = await response.json();
  saveSession(data); // the old refresh token is dead now, so save the new one
}

// Works like fetch, but adds both passes, and renews an expired card once
export async function authFetch(path, options = {}) {
  function send() {
    return fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${getSession().accessToken}`, // read fresh each time
        ...options.headers,
      },
    });
  }

  let response = await send();

  if (response.status === 401) {
    await refreshSession(); // throws if the refresh token is no good
    response = await send(); // retry once with the new card
  }

  return response;
}
