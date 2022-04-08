import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard, LocalAuthGuard } from './auth-guards';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verfiy.dto';
import { FireBaseLoginService } from './firebase-login.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  db: any;
  constructor(
    private readonly authSvc: AuthService,
    private readonly profileSvc: ProfileService,
    private readonly userSvc: UsersService,
    private readonly fireBaseSvc: FireBaseLoginService,
    private readonly busSvc: AzureServiceBusService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    await this.userSvc.changePassword(
      req.user.username,
      body.password,
      body.newPassword,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginDto) {
    return this.authSvc.login(body);
  }

  @Post('/fb-login/:token')
  async fbLogin(@Param('token') token: string) {
    return this.fireBaseSvc.fbLogin(token);
  }

  @Post('refresh-token/:refresh')
  async refreshToken(@Param('refresh') refresh: string) {
    const response = this.authSvc.refreshToken(refresh);
    if (response != null) {
      return response;
    }

    throw new BadRequestException();
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const code = Math.floor(100000 + Math.random() * 900000);
    const emailBody = {
      recipient: [`${body.username}`],
      subject: 'Verification Code for Scrap Ready Application',
      from: 'scrapreadyapp@gmail.com',
      body: `Your code is ${code}`,
    };

    console.log('email body', emailBody);

    this.busSvc.sendEmail(emailBody);
    await this.userSvc.create(body, code);
    // return await this.profileSvc.create(body);
  }

  @Post('verify-user')
  async verfiyUser(@Body() body: VerifyDto) {
    const isVerify = await this.userSvc.verify(body);
    if (isVerify) {
      const user = await this.userSvc.findOne(body.username);
      const regDto: RegisterDto = new RegisterDto();
      regDto.name = user.name;
      regDto.username = user.username;
      return await this.profileSvc.create(regDto);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    this.userSvc.resetPassword(email);
  }
}
