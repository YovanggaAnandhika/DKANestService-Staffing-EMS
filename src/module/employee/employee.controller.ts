import { Controller, HttpStatus } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Types } from 'mongoose';
import { IStaffingEmsEmployee } from '../../model/employee/staffing.ems.employee.model';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { removeIdHelper } from '../../helper/remove.id.helper';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('staffing.ems.employee.create')
  async CreateNewData(@Payload() data: IStaffingEmsEmployee) {
    return this.employeeService
      .Create(data)
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
        return error;
        //###########################################################
      });
  }

  @MessagePattern('staffing.ems.employee.read.all')
  async ReadAllData(@Payload() payload: any) {
    return this.employeeService
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

  @MessagePattern('staffing.ems.employee.read.all.with.id')
  async ReadAllDataWithID(@Payload() payload: any) {
    return this.employeeService
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

  @MessagePattern('staffing.ems.employee.read.search.one.by.id')
  async ReadSearchBy(@Payload() data: any) {
    return this.employeeService
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

  @MessagePattern('staffing.ems.employee.update.by.id')
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

    return this.employeeService
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

  @MessagePattern('staffing.ems.employee.delete.many.by.id')
  async DeleteManyById(@Payload() payload: Array<string>) {
    return this.employeeService
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
