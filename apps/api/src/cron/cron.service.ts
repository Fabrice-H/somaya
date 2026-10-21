import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { detectInactiveCustomers } from "@somaya/core/features/automations/server/inactive";
import { dispatchOutboxEvents } from "@somaya/core/features/automations/server/outbox";
import { runReconcile } from "@somaya/core/features/automations/server/reconcile";
import { retryVendiaDeliveries } from "@somaya/core/features/vendia/server/service";

const TIMEZONE = "Africa/Abidjan";
const OUTBOX_INTERVAL_MS = 10_000;

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private outboxBusy = false;

  @Interval(OUTBOX_INTERVAL_MS)
  async outbox() {
    if (this.outboxBusy) return;
    this.outboxBusy = true;
    try {
      const report = await dispatchOutboxEvents();
      if (report.dispatched || report.expired) this.logger.log(`Outbox : ${JSON.stringify(report)}`);
    } catch (error) {
      this.logger.error("Outbox en échec", error instanceof Error ? error.stack : String(error));
    } finally {
      this.outboxBusy = false;
    }
  }

  @Cron("*/5 * * * *", { timeZone: TIMEZONE })
  async vendiaRetry() {
    const report = await retryVendiaDeliveries();
    if (report.checked) this.logger.log(`Vendia : ${JSON.stringify(report)}`);
  }

  @Cron("0 5 * * *", { timeZone: TIMEZONE })
  async reconcile() {
    const report = await this.runReconcile();
    this.logger.log(`Réconciliation : ${JSON.stringify(report)}`);
    return report;
  }

  @Cron("0 6 * * *", { timeZone: TIMEZONE })
  async customers() {
    const report = await this.runCustomers();
    this.logger.log(`Clientes inactives : ${JSON.stringify(report)}`);
    return report;
  }

  runReconcile() {
    return runReconcile();
  }

  runCustomers() {
    return detectInactiveCustomers();
  }
}
