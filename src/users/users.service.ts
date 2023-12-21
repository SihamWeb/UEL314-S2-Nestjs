import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.firstname || !createUserDto.lastname) {
      throw new BadRequestException('Le lastname et le firstname sont obligatoires.');
    }
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

  
    if (!updateUserDto.firstname && !updateUserDto.lastname) {
      throw new BadRequestException('Au moins un champ (firstname ou lastname) doit être saisi pour la mise à jour.');
    }

    if (updateUserDto.firstname) {
      user.firstname = updateUserDto.firstname;
    }

    if (updateUserDto.lastname) {
      user.lastname = updateUserDto.lastname;
    }

    await user.save();

    return user;
  }

  
  async remove(id: number):Promise<string> {
    const result = await User.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException(`Utilisateur avec Id ${id} non trouvé`);
    }
    return `Suppression de l'utilisateur avec Id ${id} réussie`;
  }
}
