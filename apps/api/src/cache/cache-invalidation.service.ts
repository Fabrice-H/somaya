import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { setCacheInvalidator } from "@somaya/core/shared/cache";
import { loadEnv } from "../env";

const REVALIDATE_TIMEOUT_MS = 5_000;

@Injectable()
export class CacheInvalidationService implements OnModuleInit {
  private readonly logger = new Logger(CacheInvalidationService.name);

  onModuleInit() {
    const env = loadEnv();
    setCacheInvalidator(async (tags) => {
      const response = await fetch(`${env.SITE_URL}/api/revalidate`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${env.CRON_SECRET}` },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(REVALIDATE_TIMEOUT_MS),
      });
      if (!response.ok) this.logger.warn(`Revalidation du site refusée (${response.status}) pour ${tags.join(", ")}`);
    });
  }
}
