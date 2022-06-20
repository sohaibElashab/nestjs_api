import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelsInterface } from './entities/label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectModel('Labels') private readonly labelsModel: Model<LabelsInterface>,
  ) {}
  async create(createLabelDto: CreateLabelDto) {
    const labels = await new this.labelsModel(createLabelDto);
    const res = await labels.save();
    return res;
  }

  async findAll() {
    return await this.labelsModel.find().exec();
  }

  async findOne(id: string): Promise<LabelsInterface> {
    const labels = await this.labelsModel.findById(id);
    if (!labels) {
      throw new NotFoundException('Could not find this labels');
    }
    return labels;
  }

  async update(id: string, updateLabelDto: UpdateLabelDto) {
    const labels = await this.findOne(id);
    if (updateLabelDto.title) {
      labels.title = updateLabelDto.title;
    }
    labels.save();
    return labels;
  }

  async remove(id: string) {
    return this.labelsModel.findByIdAndDelete(id);
  }
}
