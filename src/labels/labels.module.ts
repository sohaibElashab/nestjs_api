import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelsSchema } from './entities/label.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Labels', schema: LabelsSchema }]),
  ],
  controllers: [LabelsController],
  providers: [LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}
