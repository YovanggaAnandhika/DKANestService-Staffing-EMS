import { ClientsModule, Transport } from '@nestjs/microservices';
import * as fs from 'node:fs';
import { DynamicModule } from '@nestjs/common';
import { ConnectionOptions } from 'tls';
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger(`ClientModuleConfig`);
let TLSOptions: ConnectionOptions | undefined = undefined;

if (
  process.env.DKA_SSL_CA_PATH &&
  process.env.DKA_SSL_CLIENT_KEY_PATH &&
  process.env.DKA_SSL_CLIENT_CERT_PATH
) {
  TLSOptions = {
    ca: [fs.readFileSync(`${process.env.DKA_SSL_CA_PATH}`, 'utf-8')],
    key: fs.readFileSync(`${process.env.DKA_SSL_CLIENT_KEY_PATH}`, 'utf-8'),
    cert: fs.readFileSync(`${process.env.DKA_SSL_CLIENT_CERT_PATH}`, 'utf-8'),
  };
} else {
  logger.warn(
    `SSL options not provided, please set DKA_SSL_CA_PATH, DKA_SSL_CLIENT_KEY_PATH and DKA_SSL_CLIENT_CERT_PATH env variables`,
  );
  logger.warn(`for security reason. please add it in your .env file`);
}

export const AccountClient: DynamicModule = ClientsModule.register([
  {
    name: 'DKA_ACCOUNT',
    transport: Transport.TCP,
    options: {
      host: `${process.env.DKA_HOST_ACCOUNT_SERVICE || 'localhost'}`,
      port: Number(process.env.DKA_PORT_ACCOUNT_SERVICE || 80),
      tlsOptions: TLSOptions,
    },
  },
]);

export const DataClient: DynamicModule = ClientsModule.register([
  {
    name: 'DKA_DATA',
    transport: Transport.TCP,
    options: {
      host: `${process.env.DKA_HOST_DATA_SERVICE || 'localhost'}`,
      port: Number(process.env.DKA_PORT_DATA_SERVICE || 80),
      tlsOptions: TLSOptions,
    },
  },
]);

export const DeveloperClient: DynamicModule = ClientsModule.register([
  {
    name: 'DKA_DEVELOPER',
    transport: Transport.TCP,
    options: {
      host: `${process.env.DKA_HOST_DEVELOPER_SERVICE || 'localhost'}`,
      port: Number(process.env.DKA_PORT_DEVELOPER_SERVICE || 80),
      tlsOptions: TLSOptions,
    },
  },
]);

export default { AccountClient, DataClient, DeveloperClient };
