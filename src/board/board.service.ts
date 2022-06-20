import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardInterface } from './entities/board.entity';
import { CreateStatusdDto } from './dto/create-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateObjectifdDto } from './dto/create-objectif.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateObjectifdDto } from './dto/update-objectif.dto';
import { UserService } from 'src/user/user.service';
import { LabelsService } from './../labels/labels.service';

@Injectable()
export class BoardService {
  constructor(
    private userService: UserService,
    private labelsService: LabelsService,
    @InjectModel('Board') private readonly boardModel: Model<BoardInterface>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const board = await new this.boardModel(createBoardDto);
    return await board.save();
  }

  async findAll() {
    return await this.boardModel
      .find()
      .populate('objectifs.labels', 'title', 'Labels')
      .populate('objectifs.assign', 'username', 'User')
      .populate('members', 'username', 'User')
      .exec();
  }

  async findOne(id: string): Promise<BoardInterface> {
    const board = await this.boardModel.findById(id).populate({
      path: 'objectifs',
      populate: {
        path: 'assign',
        model: 'User',
        select: 'username',
      },
    });
    if (!board) {
      throw new NotFoundException('Could not find this board');
    }
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const board = await this.findOne(id);
    if (updateBoardDto.title) {
      board.title = updateBoardDto.title;
    }
    if (updateBoardDto.description) {
      board.description = updateBoardDto.description;
    }
    if (updateBoardDto.members) {
      updateBoardDto.members.forEach((element) => {
        this.userService.findOne(element);
      });
      const members = [];
      updateBoardDto.members.forEach((element) => {
        if (!board.members.includes(element)) {
          members.push(element);
        }
      });
      board.members.forEach((el) => {
        if (!updateBoardDto.members.includes(el)) {
          members.push(el);
        }
      });
      board.members = members;
    }
    return await board.save();
  }

  async remove(id: string) {
    return this.boardModel.findByIdAndDelete(id);
  }

  async searchData(path: string, value: string) {
    var query = {};
    query[path] = {
      $regex: value,
    };
    return this.boardModel
      .aggregate([
        {
          $match: query,
        },
      ]);
  }

  async FindBoardByPagination(documentsToSkip = 0, limitOfDocuments = 2) {
    const boardPaginat = await this.boardModel
      .find()
      .skip(documentsToSkip)
      .limit(limitOfDocuments)
      .exec();
    return boardPaginat;
  }

  async createStatus(createStatusdDto: CreateStatusdDto, board_id: string) {
    const board = await this.findOne(board_id);
    var status_key = uuidv4();
    while (this.findStatus(board_id, status_key) == null) {
      status_key = uuidv4();
    }
    createStatusdDto.status_key = status_key;
    // createStatusdDto.status_key = '1a22549f-9fc3-40ad-9bce-bcae6326768d';
    if (board.status.length == 0) {
      createStatusdDto.index = 0;
    } else {
      createStatusdDto.index = board.status.length;
    }
    board.status.push(createStatusdDto);
    const res = await board.save();
    return res;
  }

  async updateStatus(updateStatusDto: UpdateStatusDto, status_id: string) {
    const st = await this.boardModel.find({
      'status.status_key': status_id,
    });
    let statusIndex = st[0]?.status.findIndex(
      (obj) => obj.status_key == status_id,
    );
    st[0].status[statusIndex].title = updateStatusDto.title;
    const board = await this.boardModel.findOneAndUpdate(
      {
        'status.status_key': status_id,
      },
      {
        status: st[0].status,
      },
      {
        new: true,
      },
    );

    return board;
  }

  async findAllStatus(board_id: string) {
    const board = await this.findOne(board_id);
    return board.status;
  }

  async deleteStatus(status_id: string, board_id: string) {
    const board = await this.findOne(board_id);
    board.status = board.status.filter(function (element) {
      return element.status_key !== status_id;
    });
    board.objectifs = board.objectifs.filter(function (element) {
      return element.status !== status_id;
    });
    board.status.forEach((element, index) => {
      element.index = index;
    });
    return await board.save();
  }

  async findStatus(board_id: string, status_id: string) {
    const board = await this.findOne(board_id);
    var el = {};
    board.status.forEach((element) => {
      if (element.status_key === status_id) {
        console.log(element);
        //return element;
        el = element;
      }
    });
    return el;
    //return 'null';
  }

  async FindStatusByPagination(
    documentsToSkip = 0,
    limitOfDocuments = 2,
    board_id: string,
  ) {
    const board = await this.findOne(board_id);
    let status = board.status;
    let res = [];
    for (let index = 0; index < status.length; index++) {
      if (index >= documentsToSkip) {
        if (res.length <= limitOfDocuments - 1) {
          res.push(status[index]);
        }
      }
    }
    return res;
  }

  async createObjectifs(
    createObjectifdDto: CreateObjectifdDto,
    status_id: string,
    board_id: string,
  ) {
    const board = await this.findOne(board_id);
    if (this.findStatus(board_id, status_id) == null) {
      throw new NotFoundException('Could not find this status : ' + status_id);
    }
    var objectif_key = uuidv4();
    while (this.findObjectifsForBoard(board_id, objectif_key) == null) {
      objectif_key = uuidv4();
    }
    createObjectifdDto.objectif_key = objectif_key;
    createObjectifdDto.status = status_id;
    board.objectifs.push(createObjectifdDto);
    return await board.save();
  }

  async findObjectifsForBoard(board_id: string, objectif_id: string) {
    const board = await this.findOne(board_id);
    board.objectifs.forEach((element) => {
      if (element.objectif_key === objectif_id) return element;
    });
    return null;
  }

  async findObjectifsStatus(board_id: string, status_id: string) {
    const board = await this.findOne(board_id);
    const res = board.objectifs.filter((element) => {
      return element.status === status_id;
    });
    return res;
  }

  async updateObjectifs(
    updateObjectifdDto: UpdateObjectifdDto,
    objectif_id: string,
  ) {
    const st = await this.boardModel.find({
      'objectifs.objectif_key': objectif_id,
    });
    let objectifsIndex = st[0]?.objectifs.findIndex(
      (obj) => obj.objectif_key == objectif_id,
    );
    if (updateObjectifdDto.title) {
      st[0].objectifs[objectifsIndex].title = updateObjectifdDto.title;
    }
    if (updateObjectifdDto.description) {
      st[0].objectifs[objectifsIndex].description =
        updateObjectifdDto.description;
    }
    if (updateObjectifdDto.due_date) {
      st[0].objectifs[objectifsIndex].due_date = updateObjectifdDto.due_date;
    }
    if (updateObjectifdDto.status) {
      st[0].objectifs[objectifsIndex].status = updateObjectifdDto.status;
    }
    if (updateObjectifdDto.priority) {
      st[0].objectifs[objectifsIndex].priority = updateObjectifdDto.priority;
    }
    if (updateObjectifdDto.labels) {
      const label = await this.labelsService.findOne(updateObjectifdDto.labels);
      if (
        st[0].objectifs[objectifsIndex].labels.includes(
          updateObjectifdDto.labels,
        )
      ) {
        st[0].objectifs[objectifsIndex].labels = st[0].objectifs[
          objectifsIndex
        ].labels.filter((el) => {
          return el !== updateObjectifdDto.labels;
        });
      } else {
        st[0].objectifs[objectifsIndex].labels.push(updateObjectifdDto.labels);
      }
      // st[0].objectifs[objectifsIndex].labels = []
    }
    if (updateObjectifdDto.assign) {
      const member = this.userService.findOne(updateObjectifdDto.assign);
      if (st[0].members.includes(updateObjectifdDto.assign)) {
        st[0].objectifs[objectifsIndex].assign = updateObjectifdDto.assign;
      } else {
        throw new NotFoundException(
          'Please add this user to members befor beign assigned to this objectif',
        );
      }
    }
    const board = await this.boardModel.findOneAndUpdate(
      {
        'objectifs.objectif_key': objectif_id,
      },
      {
        objectifs: st[0].objectifs,
      },
      {
        new: true,
      },
    );
    board.save();
    return board;
  }

  async deleteObjectifs(objectif_id: string, board_id: string) {
    const board = await this.findOne(board_id);
    board.objectifs = board.objectifs.filter(function (element) {
      return element.objectif_key !== objectif_id;
    });
    return await board.save();
  }

  async findAllObjectifs(board_id: string) {
    const board = await this.findOne(board_id);
    return board.objectifs;
  }

  async FindObjectifsByPagination(
    documentsToSkip = 0,
    limitOfDocuments = 2,
    board_id: string,
  ) {
    const board = await this.findOne(board_id);
    let objectifs = board.objectifs;
    let res = [];
    for (let index = 0; index < objectifs.length; index++) {
      if (index >= documentsToSkip) {
        if (res.length <= limitOfDocuments - 1) {
          res.push(objectifs[index]);
        }
      }
    }
    return res;
  }
}
