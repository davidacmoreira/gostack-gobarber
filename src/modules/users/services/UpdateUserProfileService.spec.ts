import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserProfileService from './UpdateUserProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateUserProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'John',
      email: 'john@example.com',
    });

    expect(updatedUser.name).toBe('John');
    expect(updatedUser.email).toBe('john@example.com');
  });

  it(`should not be able to update to another user's email`, async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'John',
      email: 'john@example.com',
      password: '654321',
      previous_password: '123456',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update user password without previous password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'John',
        email: 'john@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong previous password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'John',
        email: 'john@example.com',
        password: '654321',
        previous_password: 'wrong-previous-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
