import posthog from "posthog-js";

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      "phc_FrYqhNKgW7LuRGnIZEnOdoFMIAtMlXtyEtVa8BmChym", // Replace with your actual API key
      {
        api_host: "https://us.i.posthog.com",
        debug: true, // Enable debug mode to see events in the console
      }
    );
  },
};
