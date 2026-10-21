import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { loadEnv } from "./env";

async function bootstrap() {
  const env = loadEnv();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  app.useBodyParser("json", { limit: "64kb" });
  app.use(helmet());
  app.disable("x-powered-by");
  app.enableShutdownHooks();
  await app.listen(env.API_PORT);
  new Logger("Bootstrap").log(`API prête sur http://localhost:${env.API_PORT}`);
}

void bootstrap();
