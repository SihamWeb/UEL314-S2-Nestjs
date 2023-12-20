import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await User.create(createUserDto as Omit<User, 'id'>);
    return user;
  }

  async findAll(){
    const users = await User.findAll();
    if (users.length === 0) {
      throw new Error('Aucun user trouvé');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundException(`L'user avec Id #${id} non trouvé`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec Id ${id} non trouvé`);
    }
    await user.update(updateUserDto);
    return user;
  }
  
  async remove(id: number): Promise<void> {
    const result = await User.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException(`Utilisateur avec Id ${id} non trouvé`);
    }
    return `Suppression de l'utilisateur avec Id ${id} réussie`;
  }
}
