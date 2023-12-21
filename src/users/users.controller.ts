import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return createdUser;
    }
    catch (error) {
      throw new NotFoundException('Il y a des erreurs dans la creation d utilisateur');
    } 
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return users;
    } catch (error) {
      throw new NotFoundException('Il y a des erreurs dans la récupération de tous les utilisateurs');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      return user;
    } catch (error) {
        throw new NotFoundException('Il y a des erreurs lors de la récupération d un utilisateur par id');
    }
  }  

  @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      try {      
        return this.usersService.update(+id, updateUserDto);
      }
      catch (error) {
        throw new NotFoundException('Il y a des erreurs dans la modification d un utilisateur');
      }
    }

  @Delete(':id')
async remove(@Param('id') id: string): Promise<string> {
  try {
    const result = await this.usersService.remove(+id);
    return result.toString();
  } catch (error) {
    throw new NotFoundException('Il y a des erreurs dans la suppression d utilisateur');
  }
}
}
