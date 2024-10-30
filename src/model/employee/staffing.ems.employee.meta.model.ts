import mongoose, { Document } from 'mongoose';

export interface IStaffingEmsEmployeeMetaTime {
  humanize: mongoose.Schema.Types.String;
  unix: mongoose.Schema.Types.Number;
}

export interface IStaffingEmsEmployeeMeta extends Document {
  reference: mongoose.Schema.Types.ObjectId;
  parent: mongoose.Schema.Types.ObjectId;
  time_created: IStaffingEmsEmployeeMetaTime;
  time_updated: IStaffingEmsEmployeeMetaTime;
  status: mongoose.Schema.Types.Boolean;
}
