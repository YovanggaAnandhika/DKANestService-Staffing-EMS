import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { StaffingEmsEmployeeMetaModel } from '../../../schema/employee/staffing.ems.employee.meta.schema';
import { IStaffingEmsEmployeeMeta } from '../../../model/employee/staffing.ems.employee.meta.model';

@Injectable()
export class MetaService {
  private readonly logger: Logger = new Logger(MetaService.name);
  @InjectConnection()
  private readonly connection: mongoose.Connection;
  @InjectModel(StaffingEmsEmployeeMetaModel.modelName)
  private readonly db: Model<IStaffingEmsEmployeeMeta>;
  @Inject('DKA_ACCOUNT')
  private readonly account: ClientProxy;
  constructor() {}

  async Create(payload: IStaffingEmsEmployeeMeta) {
    const db = new this.db(payload);
    return db.save();
  }

  async ReadAll(payload: any) {
    const aggregationArray: PipelineStage[] = [];

    aggregationArray.push({
      $lookup: {
        from: StaffingEmsEmployeeMetaModel.modelName,
        localField: `parent`,
        foreignField: `_id`,
        as: `parent`,
      },
    });

    aggregationArray.push({
      $unwind: {
        path: `$parent`,
        preserveNullAndEmptyArrays: true,
      },
    });
    /** Desc Data **/
    aggregationArray.push({
      $sort: { _id: -1 },
    });

    /** add Status Check True Default **/
    aggregationArray.push({
      $match: { status: true },
    });

    /** if query limit exist add aggregate limit query **/
    if (payload.query !== undefined && payload.query.limit !== undefined) {
      aggregationArray.push({
        $limit: Number(payload.query.limit),
      });
    }

    return this.db.aggregate(aggregationArray, {
      allowDiskUse: true,
    });
  }
  async ReadAllByIds(payload: { ids: Array<string> }) {
    const aggregationArray: PipelineStage[] = [];

    /** add Status Check True Default **/
    aggregationArray.push({
      $match: {
        /** Conversi Jika Ids Adalah Array<String> menjadi Array<ObjectId> **/
        _id: { $in: payload.ids.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    });
    /** Desc Data **/
    aggregationArray.push({
      $sort: { _id: -1 },
    });
    /** add Status Check True Default **/
    aggregationArray.push({
      $match: { status: true },
    });
    /** Returning Function **/
    /** Return With Promise Wait **/
    return this.db.aggregate(aggregationArray, {
      allowDiskUse: true,
    });
  }
  async ReadOneData(id: string) {
    return this.db.aggregate(
      [
        {
          $match: {
            $and: [{ _id: new mongoose.Types.ObjectId(`${id}`) }],
          },
        },
      ],
      { allowDiskUse: true },
    );
  }
  async UpdateById(data: { id: string; data: object }) {
    return await this.db.findByIdAndUpdate(data.id, data.data).exec();
  }

  async DeleteByIds(ids: Array<string> = []) {
    /** Start From Connection Session **/
    const session = await this.connection.startSession();
    /** Convert Array String To ObjectID **/
    const convertIdsToObjID = ids.map(
      (data) => new mongoose.Types.ObjectId(data),
    );
    /** connection Start Session **/
    session.startTransaction();
    /** action Return Collection For Deletes many **/
    return (
      this.connection
        .collection(StaffingEmsEmployeeMetaModel.modelName)
        /** Delete Many With Session **/
        .deleteMany({ _id: { $in: convertIdsToObjID } }, { session: session })
        .then(async (result) => {
          if (result.deletedCount !== ids.length) {
            // Jumlah yang dihapus tidak sesuai, abort transaksi (rollback)
            return session.abortTransaction().then(() => {
              return Promise.reject(
                'Beberapa ID tidak ditemukan, operasi dibatalkan.',
              );
            });
          }
          // Commit transaksi jika berhasil
          return session
            .commitTransaction()
            .then(() => 'Penghapusan berhasil dan transaksi di-commit.');
        })
        .finally(() => {
          session.endSession(); // Akhiri sesi transaksi
        })
    );
  }
}
