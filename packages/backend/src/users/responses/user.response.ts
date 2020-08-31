import { ApiResponse } from 'src/shared/interfaces/api.response';
import { UserEntity } from '../entities/user.entity';

export class UserResponse implements ApiResponse {
  data: {
    user: UserEntity;
  };
}
