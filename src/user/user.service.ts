import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {username: username},
    })
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {email: email},
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.usersRepository.findOne(id);
    const updated = Object.assign(toUpdate, updateUserDto);
    return await this.usersRepository.save(updated);
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
