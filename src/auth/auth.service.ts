import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(pass, user.password)) {
      return user;
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async signPayload(userLogin: LoginAuthDto, signup, user) {
    if (!signup) {
      user = await this.validateUser(userLogin.email, userLogin.password);
    }
    const payload = { id: user.id, username: user.username, role: user.role };
    var token = this.jwtService.sign(payload);

    return {
      user: user,
      token: token,
    };
  }

  async useVerify(token: any) {
    try {
      await this.jwtService.verify(token.token);
      return 'token valid';
    } catch (error) {
      throw new Error('invalid token');
    }
  }
}
