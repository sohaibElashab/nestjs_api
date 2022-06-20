import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const res = await user.save();
    return this.sanitizeUser(res);
  }

  async findByEmail(email) {
    return await this.userModel.findOne({ email: email });
  }

  async findByLogin(UserDTO: LoginAuthDto) {
    const { email, password } = UserDTO;
  }

  sanitizeUser(user: UserInterface) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Could not find this user');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (updateUserDto.email) {
      const userEmail = await this.userModel.find({
        email: updateUserDto.email,
      });
      if (!userEmail) {
        user.email = updateUserDto.email;
      }
    }
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }
    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }
    return user.save();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
