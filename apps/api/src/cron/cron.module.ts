import { Module } from "@nestjs/common";
import { CronController } from "./cron.controller";
import { CronGuard } from "./cron.guard";
import { CronService } from "./cron.service";

@Module({
  controllers: [CronController],
  providers: [CronService, CronGuard],
})
export class CronModule {}
