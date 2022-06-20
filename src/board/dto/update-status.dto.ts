import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { CreateStatusdDto } from './create-status.dto';

export class UpdateStatusDto extends PartialType(CreateStatusdDto) {}
