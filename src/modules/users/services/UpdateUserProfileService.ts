import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  previous_password?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    previous_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userUpdatedEmail && userUpdatedEmail.id !== user_id) {
      throw new AppError('User not found');
    }

    user.name = name;
    user.email = email;

    if (password && !previous_password) {
      throw new AppError('Inform the previous password to set a new password');
    }

    if (password && previous_password) {
      const checkPreviousPassord = await this.hashProvider.compareHash(
        previous_password,
        user.password,
      );

      if (!checkPreviousPassord) {
        throw new AppError('Wrong previous password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateUserProfileService;
