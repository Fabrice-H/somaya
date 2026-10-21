import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CronGuard } from "./cron.guard";
import { CronService } from "./cron.service";

@Controller("cron")
@UseGuards(CronGuard)
export class CronController {
  constructor(private readonly cron: CronService) {}

  @Get("reconcile")
  @Post("reconcile")
  async reconcile() {
    return { ok: true, report: await this.cron.runReconcile(), at: new Date().toISOString() };
  }

  @Get("customers")
  @Post("customers")
  async customers() {
    return { ok: true, report: await this.cron.runCustomers(), at: new Date().toISOString() };
  }

  @Post("outbox")
  async outbox() {
    await this.cron.outbox();
    return { ok: true, at: new Date().toISOString() };
  }
}
