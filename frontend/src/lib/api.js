const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export async function apiRequest(path, options = {}) {
  const { body, headers, token, ...restOptions } = options;

  const response = await fetch(buildApiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...restOptions,
  });

  const rawResponse = await response.text();
  let data = {};

  if (rawResponse) {
    try {
      data = JSON.parse(rawResponse);
    } catch {
      throw new Error("The server returned an unreadable response.");
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong while talking to the server.");
  }

  return data;
}

export { API_BASE_URL };
