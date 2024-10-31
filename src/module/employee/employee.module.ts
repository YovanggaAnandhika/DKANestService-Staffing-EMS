import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import StaffingEmsEmployeeSchema, {
  StaffingEmsEmployeeModel,
} from '../../schema/employee/staffing.ems.employee.schema';
import { MetaModule } from './meta/meta.module';
import { AccountClient } from '../../config/client.module.config';
import StaffingEmsEmployeeMetaSchema, {
  StaffingEmsEmployeeMetaModel,
} from '../../schema/employee/staffing.ems.employee.meta.schema';

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
        schema: StaffingEmsEmployeeSchema,
        name: StaffingEmsEmployeeModel.modelName,
      },
      {
        schema: StaffingEmsEmployeeMetaSchema,
        name: StaffingEmsEmployeeMetaModel.modelName,
      },
    ]),
    MetaModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
