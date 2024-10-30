import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StaffingEmsEmployeeMetaModel,
  StaffingEmsEmployeeMetaSchema,
} from '../../../schema/employee/staffing.ems.employee.meta.schema';
import { DatabaseConnectionConfig_1 } from '../../../config/database.connection.config';

@Module({
  imports: [
    DatabaseConnectionConfig_1,
    MongooseModule.forFeature(
      [
        {
          schema: StaffingEmsEmployeeMetaSchema,
          name: StaffingEmsEmployeeMetaModel.modelName,
        },
      ],
      'CONN_1',
    ),
  ],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}
