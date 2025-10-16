export const testData = {
  validPageview: {
    type: "pageview" as const,
    site_id: "site_1",
  },
  validCustomEvent: {
    type: "custom_event" as const,
    site_id: "site_1",
    event_name: "signup",
    properties: JSON.stringify({ plan: "pro", step: 1 }),
  },
  validError: {
    type: "error" as const,
    site_id: "site_1",
    event_name: "TypeError",
    properties: JSON.stringify({ message: "boom", stack: "at line 1" }),
  },
  invalidPayload: {
    type: "pageview",
  },
  invalidCustomEventProperties: {
    type: "custom_event",
    site_id: "site_1",
    event_name: "signup",
    properties: "{invalid-json}",
  },
};
