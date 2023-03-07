import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PORT } from './shared/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DoricAPI')
    .setDescription('API fournissant les informations sur Dorica RPG')
    .setVersion('1.0')
    .setContact(
      "Jessica Dupont", 
      "http://alagaesiAPI.jessicadupont.net", 
      "contact@jessicadupont.net"
    )
    .addBasicAuth({
      type: 'apiKey', 
      name: 'dorica-API-key', 
      in: 'header'
    })
    .addTag('Users', "Utilisateurs de l'API")
    .addTag('Tests', "Tests en pagaille")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  console.log("http://localhost:"+PORT);
  console.log("Entrée api (swagger) : http://localhost:"+PORT+"/api");
  console.log("Documentation swagger.json : http://localhost:"+PORT+"/api-json");
  await app.listen(PORT);
}
bootstrap();
