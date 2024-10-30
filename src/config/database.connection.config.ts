import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

export const DatabaseConnectionConfig_0: DynamicModule = MongooseModule.forRoot(
  `mongodb://${process.env.DKA_DB_MONGO_HOST || 'localhost'}`,
  {
    connectionName: 'CONN_0',
    noDelay: true,
    auth: {
      username: `${process.env.DKA_DB_MONGO_USERNAME || 'root'}`,
      password: `${process.env.DKA_DB_MONGO_PASSWORD || '123456'}`,
    },
    dbName: `${process.env.DKA_DB_MONGO_DATABASE || 'staffing-ems'}`,
  },
);

export const DatabaseConnectionConfig_1: DynamicModule = MongooseModule.forRoot(
  `mongodb://${process.env.DKA_DB_MONGO_HOST || 'localhost'}`,
  {
    connectionName: 'CONN_1',
    noDelay: true,
    auth: {
      username: `${process.env.DKA_DB_MONGO_USERNAME || 'root'}`,
      password: `${process.env.DKA_DB_MONGO_PASSWORD || '123456'}`,
    },
    dbName: `${process.env.DKA_DB_MONGO_DATABASE || 'staffing-ems'}`,
  },
);

export const DatabaseConnectionConfig_2: DynamicModule = MongooseModule.forRoot(
  `mongodb://${process.env.DKA_DB_MONGO_HOST || 'localhost'}`,
  {
    connectionName: 'CONN_2',
    noDelay: true,
    auth: {
      username: `${process.env.DKA_DB_MONGO_USERNAME || 'root'}`,
      password: `${process.env.DKA_DB_MONGO_PASSWORD || '123456'}`,
    },
    dbName: `${process.env.DKA_DB_MONGO_DATABASE || 'staffing-ems'}`,
  },
);

export const DatabaseConnectionConfig_3: DynamicModule = MongooseModule.forRoot(
  `mongodb://${process.env.DKA_DB_MONGO_HOST || 'localhost'}`,
  {
    connectionName: 'CONN_3',
    noDelay: true,
    auth: {
      username: `${process.env.DKA_DB_MONGO_USERNAME || 'root'}`,
      password: `${process.env.DKA_DB_MONGO_PASSWORD || '123456'}`,
    },
    dbName: `${process.env.DKA_DB_MONGO_DATABASE || 'staffing-ems'}`,
  },
);

export default {
  DatabaseConnectionConfig_0,
  DatabaseConnectionConfig_1,
  DatabaseConnectionConfig_2,
  DatabaseConnectionConfig_3,
};
