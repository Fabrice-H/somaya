import "server-only";
import { unstable_cache } from "next/cache";
import { getLoyaltySettings } from "@somaya/core/features/loyalty/server/settings";
import { LOYALTY_CACHE_TAG } from "../constants";

export * from "@somaya/core/features/loyalty/server/settings";

export const getPublicLoyaltySettings = unstable_cache(getLoyaltySettings, ["loyalty-settings"], {
  revalidate: 300,
  tags: [LOYALTY_CACHE_TAG],
});
