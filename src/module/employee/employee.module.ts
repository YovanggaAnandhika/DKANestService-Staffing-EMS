import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseConnectionConfig_0 } from '../../config/database.connection.config';
import { MongooseModule } from '@nestjs/mongoose';
import StaffingEmsEmployeeSchema, {
  StaffingEmsEmployeeModel,
} from '../../schema/employee/staffing.ems.employee.schema';
import { MetaModule } from './meta/meta.module';

@Module({
  imports: [
    DatabaseConnectionConfig_0,
    MongooseModule.forFeature(
      [
        {
          schema: StaffingEmsEmployeeSchema,
          name: StaffingEmsEmployeeModel.modelName,
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
