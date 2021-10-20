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
    const userToCreate = new User(createUserDto);
    const createdUser = await this.usersRepository.save(userToCreate);
    if (createdUser) {
        return new User(createdUser.toJSON());
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (users)
      return users.map(user => new User(user.toJSON()));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user)
      return new User(user.toJSON());
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {username: username},
    });
    if (user)
      return new User(user.toJSON());
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {email: email},
    });
    if (user)
      return new User(user.toJSON());
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {username: username},
    });
    if (user && user.password === password) {
      return new User(user.toJSON());
    }
    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.usersRepository.findOne(id);
    const updated = Object.assign(toUpdate, updateUserDto);
    const updatedUser = await this.usersRepository.save(updated);
    return new User(updatedUser.toJSON());
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
