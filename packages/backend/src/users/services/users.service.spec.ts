import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from './users.service';

const prismaServiceMock = {
  user: {
    findMany: jest.fn(() => []),
    findOne: jest.fn(() => ({})),
    count: jest.fn(() => 1),
    create: jest.fn(() => ({})),
    update: jest.fn(() => ({})),
    delete: jest.fn(() => ({})),
  },
};

const bcryptServiceMock = {
  hashPassword: jest.fn((arg) => arg.split('').reverse().join('')),
};

const configServiceMock = {
  get: jest.fn(() => '200'),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let bcrypt: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: BcryptService, useValue: bcryptServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    bcrypt = module.get<BcryptService>(BcryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call prisma user.finMany with arguments when call find method', async () => {
    // Arrange
    const args = { where: { id: 1 } };
    const expectedArgs = {
      orderBy: { id: 'asc' },
      take: 200,
      where: { id: 1 },
    };

    // Act
    await service.find(args);

    // Assert
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.user.findMany).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call prisma user.findOne with arguments when call findById method', async () => {
    // Arrange
    const id = 7;
    const expectedArgs = { where: { id } };

    // Act
    await service.findById(id);

    // Assert
    expect(prisma.user.findOne).toHaveBeenCalledTimes(1);
    expect(prisma.user.findOne).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call prisma user.count with arguments when call count method', async () => {
    // Arrange
    const args = { where: { username: 'John' } };

    // Act
    await service.count(args);

    // Assert
    expect(prisma.user.count).toHaveBeenCalledTimes(1);
    expect(prisma.user.count).toHaveBeenCalledWith(args);
  });

  it('should call prisma user.create with arguments when call create method', async () => {
    // Arrange
    const user: CreateUserDto = {
      email: 'test@test.com',
      password: 'secret',
      username: 'funnyName',
    };
    const expectedArgs = {
      data: { ...user, password: user.password.split('').reverse().join('') },
    };

    // Act
    await service.create(user);

    // Assert
    expect(bcrypt.hashPassword).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashPassword).toHaveBeenCalledWith(user.password);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.user.create).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call prisma user.update with arguments and update all user data when call update method', async () => {
    // Arrange
    const oldUser = {
      id: 1,
      email: 'old@test.com',
      password: 'oldSecret',
      username: 'oldFunnyName',
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
    };
    const user: UpdateUserDto = {
      email: 'test@test.com',
      password: 'newSecret',
      username: 'funnyName',
    };
    const id = 1;

    const { email, password, username } = user;
    const expectedArgs = {
      where: { id },
      data: { ...oldUser, email, password, username },
    };

    (prisma.user.findOne as any).mockReturnValue(oldUser);

    // Act
    await service.update(id, user);

    // Assert
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call prisma user.update with arguments and update the passed properties of the user data when call updateProperty method', async () => {
    // Arrange
    const oldUser = {
      id: 10,
      email: 'old@test.com',
      password: 'oldSecret',
      username: 'oldFunnyName',
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
    };
    const user: PatchUserDto = {
      email: 'test@test.com',
    };
    const id = 10;

    const { email } = user;
    const expectedArgs = {
      where: { id },
      data: { ...oldUser, email },
    };

    (prisma.user.findOne as any).mockReturnValue(oldUser);

    // Act
    await service.updateProperty(id, user);

    // Assert
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call prisma user.update with arguments and not update the user data when call updateProperty method with empty data', async () => {
    // Arrange
    const oldUser = {
      id: 10,
      email: 'old@test.com',
      password: 'oldSecret',
      username: 'oldFunnyName',
      createdAt: '12/12/12T10:30:23',
      updatedAt: '12/12/12T10:30:23',
    };
    const user: PatchUserDto = {
      email: '',
    };
    const id = 10;

    (prisma.user.findOne as any).mockReturnValue(oldUser);

    // Act
    await service.updateProperty(id, user);

    // Assert
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should call prisma user.delete with arguments when call remove method', async () => {
    // Arrange
    const id = 5;
    const expectedArgs = { where: { id } };

    // Act
    await service.remove(id);

    // Assert
    expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    expect(prisma.user.delete).toHaveBeenCalledWith(expectedArgs);
  });
});
