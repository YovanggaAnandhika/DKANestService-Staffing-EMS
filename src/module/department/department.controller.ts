import { Controller } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
}
