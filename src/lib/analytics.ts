export const trackEvent = async (eventType: string, pagePath: string = window.location.pathname, metadata?: any) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        event_type: eventType, 
        page_path: pagePath,
        metadata 
      }),
      keepalive: true,
    });
  } catch (err) {
    console.error("Failed to track event:", err);
  }
};
