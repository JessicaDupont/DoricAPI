import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DoricAPI')
    .setDescription('API fournissant les informations sur Dorica RPG')
    .setVersion('1.0')
    .setContact("Jessica Dupont", "http://alagaesiAPI.jessicadupont.be", "contact@jessicadupont.be")
    .addBasicAuth({type: 'apiKey', name: 'dorica-API-key', in: 'header'})
    .addTag('Clients', "Clients de l'API")
    .addTag('Tests', "Tests en pagaille")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  let port = process.env.PORT || process.env.PORT_LOCAL;
  console.log("http://localhost:"+port);
  console.log("Entrée api (swagger) : http://localhost:"+port+"/api");
  console.log("Documentation swagger.json : http://localhost:"+port+"/api-json");
  await app.listen(port);
}
bootstrap();
