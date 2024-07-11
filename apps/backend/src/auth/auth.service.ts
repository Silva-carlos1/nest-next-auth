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
    const user = await this.userService.findByEmail(loginDto.email);

    const payload = {
      username: user.email,
      sub: user.id,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_TOKEN,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user && (await compare(loginDto.password, user.password))) {
      return {
        ...user,
        password: undefined,
      };
    }

    throw new UnauthorizedException();
  }

  async refreshToken(user: any) {
    console.log(user);
    const payload = {
      username: user.email,
      sub: user.id,
    };

    return {
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_TOKEN,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }
}
