import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ServerMicroServiceTCPConfig } from './config/server.micro.service.config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

(() => {
  //########################################################################
  const logger = new Logger('Base Main');
  //########################################################################
  NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    ServerMicroServiceTCPConfig,
  ).then((service) => {
    service
      .listen()
      .then(() => {
        logger.log('Service TCP Berjalan');
      })
      .catch((error) => {
        logger.error('Service TCP', error);
      });
  });
  //########################################################################
  /*NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    ServerMicroServiceMQTTConfig,
  ).then((service) => {
    service
      .listen()
      .then(() => {
        logger.log('Service MQTT Berjalan');
      })
      .catch((error) => {
        logger.error(`MQTT`,error);
      });
  });*/
  //########################################################################
})();
