import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  app.use(helmet());
  // app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Только для дев-сервера удалить на продакшене
app.use((req: { method: any; url: any; }, res: any, next: () => void) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

  const port = process.env.PORT ?? 3001;
  
  await app.listen(port)
    .then(() => console.log(`✅ Server successfully started on port ${port}`))
    .catch(err => console.error('❌ Failed to start server:', err));
}
bootstrap();