import mongoose, { Document } from 'mongoose';

export interface IStaffingEmsEmployeeTime {
  humanize: mongoose.Schema.Types.String;
  unix: mongoose.Schema.Types.Number;
}

export interface IStaffingEmsEmployee extends Document {
  reference: mongoose.Schema.Types.ObjectId;
  meta: mongoose.Schema.Types.ObjectId;
  time_created: IStaffingEmsEmployeeTime;
  time_updated: IStaffingEmsEmployeeTime;
  status: mongoose.Schema.Types.Boolean;
}
