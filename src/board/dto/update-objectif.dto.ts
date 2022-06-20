import { PartialType } from '@nestjs/mapped-types';
import { CreateObjectifdDto } from './create-objectif.dto';

export class UpdateObjectifdDto extends PartialType(CreateObjectifdDto) {}
