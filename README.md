# NestJS

Note: document này chỉ note vài dòng để vẽ markmap nên không thể diễn đạt đầy đủ
Link: https://docs.nestjs.com/techniques/mvc

## Description
### File `src\main.ts`
  - File đầu vào

### File `src\app.module.ts`
  - Khai báo Include các Module
  - Khai báo sử dụng biến .env
  - Connect Database

### Folder `\src\users\`    
- **File** `users.module.ts`
  - Khai báo Include các Module

- **File** `users.controller.ts`
  - File Controller: validate & call service để action
  - Chứa các method: `get`, `post`, `put`, `delete`
  - import service: để xử lý
  - import dto: để validate

- **File** `users.service.ts`
  - File xử lý CRUD
  - import entities: model db

- **Folder** `\entities\`
  - **File** `user.entity.ts`
    - Khai báo ORM của table

- **Folder** `\dto\`
  - **File** `create-user.dto.ts`
    - validate của create user

  - **File** `update-user.dto.ts`
    - validate của update user

## Code
### File `src\main.ts`
```js
import { ConfigService } from '@nestjs/config';
...
const configService = app.get(ConfigService);  
// log(process.env);
Logger.debug(`DB_HOST: ${configService.get<string>('DB_HOST')}`);
Logger.log(`DB_PORT: ${configService.get<number>('DB_PORT')}`);
Logger.log(`DB_USERNAME: ${configService.get<string>('DB_USERNAME')}`);
Logger.log(`DB_DATABASE: ${configService.get<string>('DB_DATABASE')}`);
```

### File `src\app.module.ts`
#### Khai báo Include các Module
```js
import { UsersModule } from './users/users.module';
...
@Module({
  imports: [
      UsersModule
    ]
  })
```
#### Khai báo sử dụng biến .env
```js
import { ConfigModule, ConfigService  } from '@nestjs/config';
...
@Module({
  imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        // envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
        envFilePath: '.env',
      }),
    ]
  })
```

#### Connect Database
```js
import { ConfigModule, ConfigService  } from '@nestjs/config';
...
@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        inject: [ConfigService],
      }),
      // config thông tin DB trực tiếp
      // TypeOrmModule.forRoot({
      //   type: 'mysql',
      //   host: 'localhost',
      //   port: 3306,
      //   username: 'root',
      //   password: '',
      //   database: 'nestjs_test',
      //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //   // entities: [User],
      //   synchronize: true,
      // }),
    ]
  })
```


### Init Project
#### Lệnh command
```
-- Tạo project
nest new my-nestjs-app

-- Tạo module, controller và service
nest g resource users

-- Tạo từng module, controller và service
nest g module users
nest g service users
nest g controller users
nest g class users/users.entity

-- Cài đặt TypeORM và MySQL
npm install @nestjs/typeorm typeorm mysql2

-- Cài đặt Biến môi trường
npm i --save @nestjs/config

-- Cài đặt Joi – validate data
npm i --save joi

-- Lệnh run:
npm run start
npm run start:dev
npm run build
```

#### Khai báo sử dụng biến .env
##### Tạo file .env
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=nestjs_test
```
##### update \src\app.module.ts
```
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
```
##### update \src\main.ts
```
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
...
const configService = app.get(ConfigService);
Logger.log(`DB_HOST: ${configService.get<string>('DB_HOST')}`);
```

#### Connect Database
##### update \src\app.module.ts
```
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
...
@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        inject: [ConfigService],
      }),
  ],
})
```

### Function `findAll()`
#### **File** `\src\users\users.module.ts`
```
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
...
@Module({
imports: [TypeOrmModule.forFeature([User])],
})
```
#### **File** `\src\users\users.controller.ts`
```
-- Lúc CLI generate đã có ( không thay đổi)
@Get()
findAll() {
  return this.usersService.findAll();
}
```
#### **File** `\src\users\users.service.ts`
```
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
...
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
...
findAll(): Promise<User[]> {
  return this.userRepository.find();
}
```
#### **File** `\src\users\entities\user.entity.ts`
```
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```
#### **File** `\src\users\dto\create-user.dto.ts`
#### **File** `\src\users\dto\update-user.dto.ts`

### Function `findOne()`
#### **File** `\src\users\users.controller.ts`
```
-- Lúc CLI generate đã có ( không thay đổi)
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(+id);
}
```
#### **File** `\src\users\users.service.ts`
```
import { Injectable, NotFoundException } from '@nestjs/common';
...
async findOne(id: number): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  return user;
}
```
### Function `remove()`
#### **File** `\src\users\users.controller.ts`
```
-- Lúc CLI generate đã có ( không thay đổi)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(+id);
}
```
#### **File** `\src\users\users.service.ts`
```
async remove(id: number): Promise<void> {
  const user = await this.findOne(id);
  await this.userRepository.remove(user);
}
```

### Function `create()`
#### **File** `\src\users\users.controller.ts`
```
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreateUserDto, createUserSchema  } from './dto/create-user.dto';
...
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  const { error } = createUserSchema.validate(createUserDto);
  if (error) {
    throw new BadRequestException(error.details[0].message);
  }
  return this.usersService.create(createUserDto);
}
```

#### **File** `\src\users\dto\create-user.dto.ts`
```
import * as Joi from 'joi';
...
export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export class CreateUserDto {}
```

#### **File** `\src\users\users.service.ts`
```
async create(createUserDto: CreateUserDto): Promise<User> {
  const user = this.userRepository.create(createUserDto);
  return this.userRepository.save(user);
}
```

#### **POSTMAN**  test lại
```
-- post http://localhost:3000/users
{
  "username": "edit22",
  "email": "edit22@example.com",
  "password": "4333333"
}
```

### Function `update()`
#### **File** `\src\users\users.controller.ts`
```
-- change   Patch to Put
import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException } from '@nestjs/common';
....
@Put(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(+id, updateUserDto);
}
```

#### **File** `\src\users\dto\update-user.dto.ts`
```
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    username?: string;
    email?: string;
    password?: string;
}
```

#### **File** `\src\users\users.service.ts`
```
async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.userRepository.preload({
    id: id,
    ...updateUserDto,
  });
  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  return this.userRepository.save(user);
}
```

#### **POSTMAN**  test lại
```
-- put http://localhost:3000/users/6
{
  "username": "edit2-edit",
  "email": "edit22-edit@example.com",
  "password": "4333333"
}
```