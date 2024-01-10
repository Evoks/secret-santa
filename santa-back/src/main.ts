import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import Globals from './globals.config';

async function bootstrap() {
	Globals.init();
	const appPort = process.env.APP_PORT || 3042;
	const app = await NestFactory.create(AppModule);
	// enable cors
	app.enableCors();
	await app.listen(appPort);
	console.log(`App listening on port ${appPort}`);
	app.enableShutdownHooks();
}
bootstrap();
