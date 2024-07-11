import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { hash } from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) throw new ConflictException('email duplicated');

    const newUser = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: await hash(createUserDto.password, 10),
      },
    });

    const { name, email } = newUser;

    return { name, email };
  }

  async findOrCreateUserByOAuth(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: null,
        },
      });
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: string) {
    const { name, email } = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    return { id, name, email };
  }
}
