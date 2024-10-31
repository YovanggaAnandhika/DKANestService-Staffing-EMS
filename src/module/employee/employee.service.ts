import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { StaffingEmsEmployeeModel } from '../../schema/employee/staffing.ems.employee.schema';
import { ClientProxy } from '@nestjs/microservices';
import { IStaffingEmsEmployee } from '../../model/employee/staffing.ems.employee.model';
import { StaffingEmsEmployeeMetaModel } from '../../schema/employee/staffing.ems.employee.meta.schema';

@Injectable()
export class EmployeeService {
  private readonly logger: Logger = new Logger(EmployeeService.name);
  @InjectConnection()
  private readonly connection: mongoose.Connection;
  @InjectModel(StaffingEmsEmployeeModel.modelName)
  private readonly db: Model<IStaffingEmsEmployee>;
  @Inject('DKA_ACCOUNT')
  private readonly account: ClientProxy;
  constructor() {}

  async Create(payload: IStaffingEmsEmployee) {
    const session = await this.connection.startSession();
    session.startTransaction();
    const db = new this.db(payload);
    /** save data temporary **/
    return db
      .save({ session })
      .then(async (result) => {
        /** set variable **/
        const arrayUpdates = [];
        /** checked action Resolution **/
        if (result.meta !== undefined) {
          arrayUpdates.push(
            this.connection
              .collection(StaffingEmsEmployeeMetaModel.modelName)
              .updateOne(
                { _id: result.meta },
                {
                  $set: {
                    parent: new mongoose.Types.ObjectId(`${result._id}`),
                  },
                },
                { session, writeConcern: { w: 'majority' } }, // Add writeConcern here
              ),
          );
        }
        /** return function **/
        return Promise.all(arrayUpdates)
          .then(async (AllCheckingModules) => {
            /** Check All promise If modifiedCount is 0 **/
            const totalModifiedCountFailed = AllCheckingModules.filter(
              (data) => data.modifiedCount !== 1,
            );
            /** Check If All Data is Modified **/
            if (totalModifiedCountFailed.length < 1) {
              return session.commitTransaction().then(() => {
                /** show All Data children **/
                return Promise.resolve(result);
              });
            } else {
              return session
                .abortTransaction()
                .then(() =>
                  Promise.reject(
                    `failed resolution check integrity after update. data not updated`,
                  ),
                );
            }
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      })
      .catch(async (error) => {
        this.logger.error(error);
        return session.abortTransaction().then(() =>
          Promise.reject({
            status: false,
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            msg: `Gagal Memproses Data`,
            error: error,
          }),
        );
      })
      .finally(async () => {
        await session.endSession();
      });
  }

  async ReadAll(payload: any) {
    const aggregationArray: PipelineStage[] = [];

    aggregationArray.push({
      $lookup: {
        from: StaffingEmsEmployeeMetaModel.modelName,
        localField: `meta`,
        foreignField: `_id`,
        as: `meta`,
      },
    });

    aggregationArray.push({
      $unwind: {
        path: `$meta`,
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
        .collection(StaffingEmsEmployeeModel.modelName)
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
