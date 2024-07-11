import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, LocalStrategy],
})
export class AuthModule {}
