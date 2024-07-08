import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.ValidateUser(loginDto);

    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      user,
      backendTokens: {
        acessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '20s',
          secret: process.env.JWT_TOKEN,
        }),
        RefreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }

  async ValidateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user && (await compare(loginDto.password, user.password))) {
      const { name, email } = user;
      return { name, email };
    }

    throw new UnauthorizedException();
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.email,
      sub: user.sub,
    };

    return {
      backendTokens: {
        acessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '20s',
          secret: process.env.JWT_TOKEN,
        }),
        RefreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }
}
