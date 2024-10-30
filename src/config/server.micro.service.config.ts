import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import * as process from 'node:process';
import * as fs from 'node:fs';
import { ConnectionOptions } from 'tls';
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger(`ServerMicroServiceConfig`);

let TLSOptions: ConnectionOptions | undefined = undefined;

if (
  process.env.DKA_SSL_CA_PATH &&
  process.env.DKA_SSL_SERVER_KEY_PATH &&
  process.env.DKA_SSL_SERVER_CERT_PATH
) {
  TLSOptions = {
    ca: [fs.readFileSync(`${process.env.DKA_SSL_CA_PATH}`, 'utf-8')],
    key: fs.readFileSync(`${process.env.DKA_SSL_SERVER_KEY_PATH}`, 'utf-8'),
    cert: fs.readFileSync(`${process.env.DKA_SSL_SERVER_CERT_PATH}`, 'utf-8'),
    requestCert: true,
    rejectUnauthorized: true,
  };
} else {
  logger.warn(
    `SSL options not provided, please set DKA_SSL_CA_PATH, DKA_SSL_SERVER_KEY_PATH and DKA_SSL_SERVER_CERT_PATH  env variables`,
  );
  logger.warn(`for security reason. please add it in your .env file`);
}

export const ServerMicroServiceTCPConfig: NestApplicationContextOptions &
  MicroserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: `${process.env.DKA_SERVER_HOST || '0.0.0.0'}`,
    port: Number(process.env.DKA_SERVER_PORT || 80),
    tlsOptions: TLSOptions,
  },
};

export const ServerMicroServiceMQTTConfig: MicroserviceOptions = {
  transport: Transport.MQTT,
  options: {
    url: `${process.env.DKA_MQTT_BROKER_PROTOCOL || 'mqtt'}://${process.env.DKA_MQTT_BROKER_HOST || 'mqtt.dkaapis.com'}:${process.env.DKA_MQTT_BROKER_PORT || 1883}`,
    clientId: `${process.env.DKA_MQTT_BROKER_CLIENT_ID || 'dka-patient'}`,
    reconnectPeriod: 3,
  },
};

export default { ServerMicroServiceTCPConfig, ServerMicroServiceMQTTConfig };
