import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = process.env.PORT || process.env.PORT_LOCAL;
  console.log("http://localhost:"+port);
  await app.listen(port);
}
bootstrap();
