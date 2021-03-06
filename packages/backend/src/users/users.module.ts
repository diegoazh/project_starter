import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ProfilesController } from './controllers/profiles.controller';
import { UsersController } from './controllers/users.controller';
import { ProfilesService } from './services/profiles.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [SharedModule],
  controllers: [UsersController, ProfilesController],
  providers: [UsersService, ProfilesService],
  exports: [UsersService],
})
export class UsersModule {}
