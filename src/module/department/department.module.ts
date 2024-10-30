import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DatabaseConnectionConfig_2 } from '../../config/database.connection.config';
import { MongooseModule } from '@nestjs/mongoose';
import StaffingEmsDepartmentSchema, {
  StaffingEmsDepartmentModel,
} from '../../schema/department/staffing.ems.department.schema';

@Module({
  imports: [
    DatabaseConnectionConfig_2,
    MongooseModule.forFeature(
      [
        {
          schema: StaffingEmsDepartmentSchema,
          name: StaffingEmsDepartmentModel.modelName,
        },
      ],
      'CONN_2',
    ),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
