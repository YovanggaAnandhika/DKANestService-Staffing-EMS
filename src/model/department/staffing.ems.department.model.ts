import mongoose, { Document } from 'mongoose';

export interface IStaffingEmsDepartmentTime {
  humanize: mongoose.Schema.Types.String;
  unix: mongoose.Schema.Types.Number;
}

export interface IStaffingEmsDepartment extends Document {
  reference: mongoose.Schema.Types.ObjectId;
  parent: mongoose.Schema.Types.ObjectId;
  name: mongoose.Schema.Types.String;
  description: mongoose.Schema.Types.String;
  time_created: IStaffingEmsDepartmentTime;
  time_updated: IStaffingEmsDepartmentTime;
  status: mongoose.Schema.Types.Boolean;
}
