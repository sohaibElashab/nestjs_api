import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateObjectifdDto } from './dto/create-objectif.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // boards api
  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }

  @Get('/search/board')
  thissearch(@Query() { path, value }) {
    return this.boardService.searchData(path, value);
  }

  @Get('/pagination/board')
  async findBoardsByPagination(@Query() { skip, limit }) {
    return await this.boardService.FindBoardByPagination(skip, limit);
  }

  // Status api

  @Post('/status/:board_id')
  createStatus(
    @Body() createBoardDto: CreateBoardDto,
    @Param('board_id') board_id: string,
  ) {
    return this.boardService.createStatus(createBoardDto, board_id);
  }

  @Get('/status/:board_id')
  findAllStatus(@Param('board_id') board_id: string) {
    return this.boardService.findAllStatus(board_id);
  }

  @Get('/aaaaaa/:board_id/:status_id')
  findOneStatus(
    @Param('board_id') board_id: string,
    @Param('status_id') status_id: string,
  ) {
    return this.boardService.findStatus(board_id, status_id);
  }

  @Patch('/status/:status_id')
  updateStatus(
    @Param('status_id') status_id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.boardService.updateStatus(updateStatusDto, status_id);
  }

  @Delete('/status/:board_id/:status_id')
  removeStatus(
    @Param('board_id') board_id: string,
    @Param('status_id') status_id: string,
  ) {
    return this.boardService.deleteStatus(status_id, board_id);
  }

  @Get('/pagination/Status/:board_id')
  async findStatusByPagination(
    @Param('board_id') board_id: string,
    @Query() { skip, limit },
  ) {
    return await this.boardService.FindStatusByPagination(
      skip,
      limit,
      board_id,
    );
  }

  // Objectif api

  @Post('/Objectifs/:board_id/:statu_id')
  createObjectifs(
    @Body() createObjectifdDto: CreateObjectifdDto,
    @Param('board_id') board_id: string,
    @Param('statu_id') statu_id: string,
  ) {
    return this.boardService.createObjectifs(
      createObjectifdDto,
      statu_id,
      board_id,
    );
  }

  @Get('/Objectifs/:board_id')
  findAllObjectifs(@Param('board_id') board_id: string) {
    return this.boardService.findAllObjectifs(board_id);
  }

  @Get('/Objectifs/:board_id/:status_id')
  findObjectifsStatus(
    @Param('board_id') board_id: string,
    @Param('status_id') status_id: string,
  ) {
    return this.boardService.findObjectifsStatus(board_id, status_id);
  }

  @Patch('/Objectifs/:objectif_id')
  updateObjectifs(
    @Param('objectif_id') objectif_id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.updateObjectifs(updateBoardDto, objectif_id);
  }

  @Delete('/Objectifs/:board_id/:objectif_id')
  removeObjectifs(
    @Param('board_id') board_id: string,
    @Param('objectif_id') objectif_id: string,
  ) {
    return this.boardService.deleteObjectifs(objectif_id, board_id);
  }

  @Get('/pagination/Objectifs/:board_id')
  async findObjectifsByPagination(
    @Param('board_id') board_id: string,
    @Query() { skip, limit },
  ) {
    return await this.boardService.FindStatusByPagination(
      skip,
      limit,
      board_id,
    );
  }
}
