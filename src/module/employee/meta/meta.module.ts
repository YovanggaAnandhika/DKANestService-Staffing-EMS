import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StaffingEmsEmployeeMetaModel,
  StaffingEmsEmployeeMetaSchema,
} from '../../../schema/employee/staffing.ems.employee.meta.schema';
import { AccountClient } from '../../../config/client.module.config';

@Module({
  imports: [
    AccountClient,
    MongooseModule.forRoot(
      `mongodb://${process.env.DKA_DB_MONGO_HOST || 'localhost'}`,
      {
        noDelay: true,
        auth: {
          username: `${process.env.DKA_DB_MONGO_USERNAME || 'root'}`,
          password: `${process.env.DKA_DB_MONGO_PASSWORD || '123456'}`,
        },
        dbName: `${process.env.DKA_DB_MONGO_DATABASE || 'staffing-ems'}`,
      },
    ),
    MongooseModule.forFeature([
      {
        schema: StaffingEmsEmployeeMetaSchema,
        name: StaffingEmsEmployeeMetaModel.modelName,
      },
    ]),
  ],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}
