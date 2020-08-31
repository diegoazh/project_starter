import { ApiResponse } from 'src/shared/interfaces/api.response';
import { PostEntity } from '../entities/post.entity';

export class PostResponse implements ApiResponse {
  data: {
    post: PostEntity;
  };
}
