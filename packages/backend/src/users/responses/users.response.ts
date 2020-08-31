import { ApiResponse } from 'src/shared/interfaces/api.response';
import { UserEntity } from '../entities/user.entity';

export class UsersResponse implements ApiResponse {
  data: {
    users: UserEntity[];
  };
}