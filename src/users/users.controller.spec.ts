import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { id: 1, firstname: 'John', lastname: 'Doe' } as User,
        { id: 2, firstname: 'Siham', lastname: 'Cha' } as User,
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

      expect(await controller.findAll()).toBe(users);
    });

    it('should handle errors and throw NotFoundException', async () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new Error('Il y a des erreurs dans la récupération de tous les utilisateurs'));

      await expect(controller.findAll()).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should get a user by ID', async () => {
      const user: User = { id: 1, firstname: 'John', lastname: 'Doe' } as User;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      expect(await controller.findOne('1')).toBe(user);
    });

    it('should handle errors and throw NotFoundException for invalid Id', async () => {
      const invalidId = 'invalid';

      jest.spyOn(usersService, 'findOne').mockRejectedValue(new Error('Il y a des erreurs lors de la récupération d un utilisateur par id'));

      await expect(controller.findOne(invalidId)).rejects.toThrowError(NotFoundException);
    });
  });
  
  describe('create', () => {
    it('should add a user to the database', async () => {
      const userDto: CreateUserDto = { firstname: 'John', lastname: 'Doe' };

      const createdUser: User = { id: 1, ...userDto } as User;

      jest.spyOn(usersService, 'create').mockImplementation(async () => createdUser);

      const result = await controller.create(userDto);

      expect(usersService.create).toHaveBeenCalledWith(userDto);

      expect(result).toEqual(createdUser);
    });
    it('should handle errors and throw NotFoundException', async () => {
      const userDto: CreateUserDto = { firstname: 'John', lastname: 'Doe' };

      jest.spyOn(usersService, 'create').mockRejectedValue(new NotFoundException('Il y a des erreurs dans la creation d utilisateur'));
      await expect(controller.create(userDto)).rejects.toThrowError(NotFoundException);
    });
  });
  describe('update', () => {
    it('should update a user to the database', async () => {
      const id = '1'; 
      const userDto: UpdateUserDto = { firstname: 'John', lastname: 'Doe' };
      const updatedUser: User = { id: +id, ...userDto } as User;

      jest.spyOn(usersService, 'update').mockImplementation(async () => updatedUser);

      const result = await controller.update(id, userDto);

      expect(usersService.update).toHaveBeenCalledWith(+id, userDto);
      expect(result).toBe(updatedUser);
    });
    it('should handle errors and throw NotFoundException', async () => {
      const id = '1';
      const userDto: UpdateUserDto = { firstname: 'John', lastname: 'Doe' };

      jest.spyOn(usersService, 'update').mockRejectedValue(new NotFoundException('Il y a des erreurs dans la modification d un utilisateur'));
      await expect(controller.update(id, userDto)).rejects.toThrowError(NotFoundException);
    });
  });
});

describe('remove', () => {
  it('should remove a user in the database', async () => {
    const id = '1';

    jest.spyOn(UsersService.prototype, 'remove').mockImplementation(async () => 'Suppression de l\'utilisateur avec Id 1 réussie');

    const usersController = new UsersController(new UsersService());

    const result = await usersController.remove(id);

    expect(UsersService.prototype.remove).toHaveBeenCalledWith(+id);
    expect(result).toBe('Suppression de l\'utilisateur avec Id 1 réussie');
  });

  it('should handle errors and throw NotFoundException', async () => {
    const id = '1';

    jest.spyOn(UsersService.prototype, 'remove').mockRejectedValue(new NotFoundException(`Utilisateur avec Id ${id} non trouvé`));

    const usersController = new UsersController(new UsersService());

    await expect(usersController.remove(id)).rejects.toThrowError(NotFoundException);
  });
});


  


    
