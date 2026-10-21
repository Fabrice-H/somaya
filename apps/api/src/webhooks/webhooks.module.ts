import { Module } from "@nestjs/common";
import { JekoController } from "./jeko.controller";
import { WhatsappController } from "./whatsapp.controller";

@Module({
  controllers: [JekoController, WhatsappController],
})
export class WebhooksModule {}
