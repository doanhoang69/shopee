export function createNotificationSSE() {
  return new EventSource(`${import.meta.env.VITE_API_URL}/notifications/sse`, {
    withCredentials: true,
  });
}
