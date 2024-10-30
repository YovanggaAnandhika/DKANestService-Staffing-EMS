import mongoose from 'mongoose';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AccountClientFactory } from '../../config/client.factory.config';
import { firstValueFrom } from 'rxjs';
import * as moment from 'moment/moment';
import { IStaffingEmsDepartment } from '../../model/department/staffing.ems.department.model';

export const StaffingEmsDepartmentSchema =
  new mongoose.Schema<IStaffingEmsDepartment>(
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
      parent: {
        type: mongoose.Schema.Types.ObjectId,
        validate: {
          validator: async function (value) {
            /** Checked Id Reference match to microservice user **/
            return !!(await this.model(
              StaffingEmsDepartmentModel.modelName,
            ).exists({
              _id: value,
            }));
          },
          message: 'Parent Department Data Not Exists',
        },
      },
      /**
       *
       */
      name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true,
      },
      description: {
        type: mongoose.Schema.Types.String,
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
    { collection: 'staffing_ems_department', versionKey: false, strict: true },
  );

export const StaffingEmsDepartmentModel = mongoose.model(
  'staffing_ems_departement',
  StaffingEmsDepartmentSchema,
);

export default StaffingEmsDepartmentSchema;
