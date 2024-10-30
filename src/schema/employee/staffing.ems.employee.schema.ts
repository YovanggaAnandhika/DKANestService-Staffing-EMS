import mongoose from 'mongoose';
import * as moment from 'moment';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AccountClientFactory } from '../../config/client.factory.config';
import { firstValueFrom } from 'rxjs';
import { IStaffingEmsEmployee } from '../../model/employee/staffing.ems.employee.model';
import { StaffingEmsEmployeeMetaModel } from './staffing.ems.employee.meta.schema';

export const StaffingEmsEmployeeSchema =
  new mongoose.Schema<IStaffingEmsEmployee>(
    {
      /**
       * Reference to another account, should be a valid ObjectId.
       */
      reference: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
          validator: async function (accountId) {
            /** Checked Id Reference match to microservice user **/
            const client = ClientProxyFactory.create(AccountClientFactory);
            const result = await firstValueFrom(
              client.send('user.read.search.one.by.id', { _id: accountId }),
            );
            return result.status;
          },
          message: 'Account Reference Not Exist',
        },
      },
      meta: {
        type: mongoose.Schema.Types.ObjectId,
        validate: {
          validator: async function (value) {
            /** Checked Id Reference match to microservice user **/
            return !!(await this.model(
              StaffingEmsEmployeeMetaModel.modelName,
            ).exists({
              _id: value,
            }));
          },
          message: 'Meta Employee Data Not Exists',
        },
      },
      /**
       * Time of creation.
       */
      time_created: {
        /**
         * Human-readable time of creation.
         */
        humanize: {
          type: mongoose.Schema.Types.String,
          default: moment(moment.now()).format('HH:mm:ss DD-MM-YYYY'),
        },
        /**
         * Unix timestamp of creation.
         */
        unix: {
          type: mongoose.Schema.Types.Number,
          default: moment(moment.now()).unix(),
        },
      },
      /**
       * Time of update.
       */
      time_updated: {
        /**
         * Human-readable time of update.
         */
        humanize: {
          type: mongoose.Schema.Types.String,
          default: moment(moment.now()).format('HH:mm:ss DD-MM-YYYY'),
        },
        /**
         * Unix timestamp of update.
         */
        unix: {
          type: mongoose.Schema.Types.Number,
          default: moment(moment.now()).unix(),
        },
      },
      /**
       * Status of the account (true or false).
       */
      status: {
        type: mongoose.Schema.Types.Boolean,
        default: true,
      },
    },
    { collection: 'staffing_ems_employees', versionKey: false, strict: true },
  );

export const StaffingEmsEmployeeModel = mongoose.model(
  'staffing_ems_employees',
  StaffingEmsEmployeeSchema,
);

export default StaffingEmsEmployeeSchema;
