import { Controller } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller()
export class MetaController {
  constructor(private readonly metaService: MetaService) {}
}
