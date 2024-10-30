import { ClientOptions, Transport } from '@nestjs/microservices';
import * as fs from 'node:fs';
import { Logger } from '@nestjs/common';
import { ConnectionOptions } from 'tls';

const logger: Logger = new Logger(`ClientFactoryConfig`);
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

export const AccountClientFactory: ClientOptions = {
  transport: Transport.TCP,
  options: {
    host: `${process.env.DKA_HOST_ACCOUNT_SERVICE || 'localhost'}`,
    port: Number(process.env.DKA_PORT_ACCOUNT_SERVICE || 80),
    tlsOptions: TLSOptions,
  },
};

export const DataClientFactory: ClientOptions = {
  transport: Transport.TCP,
  options: {
    host: `${process.env.DKA_HOST_DATA_SERVICE || 'localhost'}`,
    port: Number(process.env.DKA_PORT_DATA_SERVICE || 80),
    tlsOptions: TLSOptions,
  },
};

export const SessionClientFactory: ClientOptions = {
  transport: Transport.TCP,
  options: {
    host: `${process.env.DKA_HOST_SESSION_SERVICE || 'localhost'}`,
    port: Number(process.env.DKA_PORT_SESSION_SERVICE || 80),
    tlsOptions: TLSOptions,
  },
};

export default {
  AccountClientFactory,
  DataClientFactory,
  SessionClientFactory,
};
