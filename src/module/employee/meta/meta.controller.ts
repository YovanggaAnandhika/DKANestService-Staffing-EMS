import { Controller, HttpStatus } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { removeIdHelper } from '../../../helper/remove.id.helper';
import { Types } from 'mongoose';
import { IStaffingEmsEmployeeMeta } from '../../../model/employee/staffing.ems.employee.meta.model';

@Controller()
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  /**
   * @param data
   * @constructor
   * @description
   * Fungsi Untuk melakukan Message pattern pada Micro service
   */
  @MessagePattern('staffing.ems.employee.meta.create')
  async CreateNewData(@Payload() data: IStaffingEmsEmployeeMeta) {
    /** lakukan Pengembalian data dari services **/
    return (
      this.metaService
        /** Create Action Data **/
        .Create(data)
        /** Response data result **/
        .then((response) => {
          //###########################################################
          if (response === null)
            return { status: false, code: 409, msg: `Failed To Create Data` };
          //###########################################################
          return {
            status: true,
            code: HttpStatus.CREATED,
            msg: `Data Successfully Created`,
            data: response,
          };
          //###########################################################
        })
        .catch((error) => {
          //###########################################################
          return {
            status: false,
            code: HttpStatus.BAD_GATEWAY,
            msg: `Internal Server Error`,
            error: error,
          };
          //###########################################################
        })
    );
  }

  @MessagePattern('staffing.ems.employee.meta.read.all')
  async ReadAllData(@Payload() payload: any) {
    return this.metaService
      .ReadAll(payload)
      .then((response) => {
        //###########################################################
        if (response.length === 0)
          return { status: false, code: 404, msg: `Data Not Found` };
        //###########################################################
        return removeIdHelper({
          status: true,
          code: HttpStatus.OK,
          msg: `Successfully Read Data`,
          data: response,
        });
      })
      .catch((error) => {
        //###########################################################
        return {
          status: false,
          code: HttpStatus.BAD_GATEWAY,
          msg: `Error Internal Server`,
          error: error,
        };
        //###########################################################
      });
  }

  @MessagePattern('staffing.ems.employee.meta.read.all.with.id')
  async ReadAllDataWithID(@Payload() payload: any) {
    return this.metaService
      .ReadAll(payload)
      .then((response) => {
        //###########################################################
        if (response.length === 0)
          return { status: false, code: 404, msg: `Data Not Found` };
        //###########################################################
        return {
          status: true,
          code: HttpStatus.OK,
          msg: `Successfully Read Data`,
          data: response,
        };
      })
      .catch((error) => {
        //###########################################################
        return {
          status: false,
          code: HttpStatus.BAD_GATEWAY,
          msg: `Error Internal Server`,
          error: error,
        };
        //###########################################################
      });
  }

  @MessagePattern('staffing.ems.employee.meta.read.search.one.by.id')
  async ReadSearchBy(@Payload() data: any) {
    return this.metaService
      .ReadOneData(data._id)
      .then((response) => {
        //###########################################################
        if (response.length === 0)
          return { status: false, code: 404, msg: `Data Not Found` };
        //###########################################################
        return {
          status: true,
          code: HttpStatus.OK,
          msg: `Successfully Read Data`,
          data: response,
        };
      })
      .catch((error) => {
        //###########################################################
        return {
          status: false,
          code: HttpStatus.BAD_GATEWAY,
          msg: `Error Internal Server`,
          error: error,
        };
        //###########################################################
      });
  }

  @MessagePattern('staffing.ems.employee.meta.update.by.id')
  async UpdateById(@Payload() payload: { id: string; data: object }) {
    if (!Types.ObjectId.isValid(`${payload.id}`))
      return {
        status: false,
        code: HttpStatus.BAD_REQUEST,
        msg: `id not identify user id`,
      };

    if (Object.keys(payload.data).length < 1)
      return {
        status: false,
        code: HttpStatus.BAD_REQUEST,
        msg: `newest data not filled`,
      };

    return this.metaService
      .UpdateById(payload)
      .then((response) => {
        //###########################################################
        if (response === null)
          return {
            status: false,
            code: 409,
            msg: `Failed To Update Data. Id Not Find or Another Error`,
          };
        //###########################################################
        return {
          status: true,
          code: HttpStatus.OK,
          msg: `Data Successfully Change`,
          data: { id: response._id, ...payload.data },
        };
        //###########################################################
      })
      .catch((error) => {
        //###########################################################
        return {
          status: false,
          code: HttpStatus.BAD_GATEWAY,
          msg: `Internal Server Error`,
          error: error,
        };
        //###########################################################
      });
  }

  @MessagePattern('staffing.ems.employee.meta.delete.many.by.id')
  async DeleteManyById(@Payload() payload: Array<string>) {
    return this.metaService
      .DeleteByIds(payload)
      .then((response) => {
        //###########################################################
        if (response === null)
          return {
            status: false,
            code: 409,
            msg: `Failed To Update Data. Id Not Find or Another Error`,
          };
        //###########################################################
        return {
          status: true,
          code: HttpStatus.OK,
          msg: `Data Successfully Delete`,
          data: payload,
        };
        //###########################################################
      })
      .catch((error) => {
        //###########################################################
        return {
          status: false,
          code: HttpStatus.BAD_GATEWAY,
          msg: `Internal Server Error`,
          error: error,
        };
        //###########################################################
      });
  }
}
