import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseConnectionConfig_0 } from '../../config/database.connection.config';
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
    DatabaseConnectionConfig_0,
    MongooseModule.forFeature(
      [
        {
          schema: StaffingEmsEmployeeSchema,
          name: StaffingEmsEmployeeModel.modelName,
        },
        {
          schema: StaffingEmsEmployeeMetaSchema,
          name: StaffingEmsEmployeeMetaModel.modelName,
        },
      ],
      'CONN_0',
    ),
    MetaModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
