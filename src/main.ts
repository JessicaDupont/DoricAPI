import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DOTENV } from './shared/dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DoricAPI')
    .setDescription('API fournissant les informations sur Dorica RPG')
    .setVersion('1.0')
    .setContact(
      "Jessica Dupont", 
      "http://www.api.dorica.miss-ica.be", 
      "contact@jessicadupont.net"
    )
    .addTag('Users', "Utilisateurs de l'API")
    // .addBasicAuth({
    //   type: 'apiKey', 
    //   name: 'dorica-key', 
    //   in: 'header'
    // })
    .addBearerAuth({
      type: 'http', 
      name: 'Bearer', 
      bearerFormat: "Bearer",
      in: 'Header',
      scheme: "Bearer"
    }, "dorica_access")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('', app, document);

  console.log("http://localhost:"+DOTENV.port);
  console.log("Documentation swagger.json : http://localhost:"+DOTENV.port+"/api-json");
  await app.listen(DOTENV.port);
}
bootstrap();
