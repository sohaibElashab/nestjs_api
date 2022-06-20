import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [
  MongooseModule.forRoot(
      'mongodb+srv://moaj:sohaib06@cluster0.yskmj.mongodb.net/objectifs?retryWrites=true&w=majority',
    ),
  BoardModule,
  UserModule,
  AuthModule,
  LabelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
