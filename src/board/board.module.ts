import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {BoardSchema } from './entities/board.entity';
import { UserModule } from 'src/user/user.module';
import { LabelsModule } from 'src/labels/labels.module';

@Module({
  imports: [
    LabelsModule,
    UserModule,
    MongooseModule.forFeature([{ name: 'Board', schema: BoardSchema }]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
