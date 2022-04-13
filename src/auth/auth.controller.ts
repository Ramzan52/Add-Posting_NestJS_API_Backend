import { VerifyResetPassword } from './dto/verify.resetPassword.dto';
import { FireBaseLoginService } from './firebase-login.service';
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
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard, LocalAuthGuard } from './auth-guards';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { VerifyDto } from './dto/verfiy.dto';
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
    var response = this.authSvc.refreshToken(refresh);
    if (response != null) return response;
    else throw new BadRequestException();
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

    this.busSvc.sendEmail(emailBody);
    await this.userSvc.create(body, code);
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
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Req() req: any) {
    return await this.userSvc.resetPassword(req.user.username);
  }
  @UseGuards(JwtAuthGuard)
  @Post('verify/reset-password')
  async VerifyResetPassword(
    @Body() body: VerifyResetPassword,
    @Req() req: any,
  ) {
    return await this.userSvc.verifyResetPassword(body, req.user.username);
  }
}
