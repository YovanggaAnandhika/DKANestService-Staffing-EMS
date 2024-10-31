import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import StaffingEmsDepartmentSchema, {
  StaffingEmsDepartmentModel,
} from '../../schema/department/staffing.ems.department.schema';
import { AccountClient } from '../../config/client.module.config';

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
        schema: StaffingEmsDepartmentSchema,
        name: StaffingEmsDepartmentModel.modelName,
      },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
