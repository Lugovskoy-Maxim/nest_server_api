import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), UsersModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
