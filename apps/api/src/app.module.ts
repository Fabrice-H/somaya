import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { CacheInvalidationService } from "./cache/cache-invalidation.service";
import { CronModule } from "./cron/cron.module";
import { HealthController } from "./health/health.controller";
import { WebhooksModule } from "./webhooks/webhooks.module";

@Module({
  imports: [ScheduleModule.forRoot(), CronModule, WebhooksModule],
  controllers: [HealthController],
  providers: [CacheInvalidationService],
})
export class AppModule {}
