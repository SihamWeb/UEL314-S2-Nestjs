import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('./entities/user.entity');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return users array on success', async () => {
      jest.spyOn(User, 'findAll').mockResolvedValue([{ id: 1, firstname: 'John', lastname: 'Doe' } as User]);

      const result = await service.findAll();

      expect(result).toEqual([{ id: 1, firstname: 'John', lastname: 'Doe' } as User]);
    });

    it('should throw an error when no users are found', async () => {
      jest.spyOn(User, 'findAll').mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrowError('Aucun user trouvé');
    });
  });

  describe('findOne', () => {
    it('should return a user on success', async () => {
      jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, firstname: 'John', lastname: 'Doe' } as User);

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1, firstname: 'John', lastname: 'Doe' } as User);
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(User, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(new NotFoundException(`L'user avec Id #1 non trouvé`));
    });
  });
  
  describe ('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };

      (User.create as jest.Mock).mockResolvedValue({id: 1, ...createUserDto,} as User);

      const createdUser: User = await service.create(createUserDto);

      expect(createdUser).toBeDefined();
      expect(createdUser.firstname).toEqual(createUserDto.firstname);
      expect(createdUser.lastname).toEqual(createUserDto.lastname);

      expect(User.create).toHaveBeenCalledWith(createUserDto);
    });
    
    it('should throw BadRequestException for missing firstname and lastname', async () => {

      await expect(service.create({} as CreateUserDto)).rejects.toThrow(BadRequestException);
      await expect(service.create({ firstname: 'John' } as CreateUserDto)).rejects.toThrow(BadRequestException);
      await expect(service.create({ lastname: 'Doe' } as CreateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const id = 1;
      const updateUserDto = { lastname: 'Bej' };

      const mockUser = new User();
      mockUser.id = id;
      mockUser.firstname = 'John';
      mockUser.lastname = 'Doe';
      jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

      const result = await service.update(id, updateUserDto);

      expect(User.findByPk).toHaveBeenCalledWith(id);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const id = 1;
      const updateUserDto = { firstname: 'Elyes' };
      jest.spyOn(User, 'findByPk').mockResolvedValue(null);

      await expect(service.update(id, updateUserDto)).rejects.toThrowError(NotFoundException);
      expect(User.findByPk).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException when there are no changes', async () => {
      const id = 1;
      const updateUserDto = {};
      const mockUser = new User();
      mockUser.id = id;
      mockUser.firstname = 'John';
      mockUser.lastname = 'Doe';
      jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

      await expect(service.update(id, updateUserDto)).rejects.toThrowError(BadRequestException);
      expect(User.findByPk).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const id = 1;

      jest.spyOn(User, 'destroy').mockResolvedValue(1);

      const result = await service.remove(id);

      expect(User.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(`Suppression de l'utilisateur avec Id ${id} réussie`);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const id = 1;

      jest.spyOn(User, 'destroy').mockResolvedValue(0);

      await expect(service.remove(id)).rejects.toThrowError(NotFoundException);
      expect(User.destroy).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
