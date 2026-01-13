import { flag } from "flags/next";

/**
 * Feature flag that randomly enables the discount banner for 50% of users
 * Using the Next.js-specific implementation that persists the decision in session storage
 */
export const bannerFlag = flag({
  key: "banner-flag",
  decide() {
    return Math.random() > 0.5;
  },
});
