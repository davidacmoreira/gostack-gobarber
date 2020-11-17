import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppoitment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppoitment = new CreateAppointmentService(
      fakeAppoitmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 10).getTime();
    });

    const appointment = await createAppoitment.execute({
      date: new Date(2020, 0, 1, 12),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 10).getTime();
    });

    await createAppoitment.execute({
      date: new Date(2020, 0, 1, 12),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    await expect(
      createAppoitment.execute({
        date: new Date(2020, 0, 1, 12),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 12).getTime();
    });

    await expect(
      createAppoitment.execute({
        date: new Date(2020, 0, 1, 10),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 10).getTime();
    });

    await expect(
      createAppoitment.execute({
        date: new Date(2020, 0, 1, 12),
        provider_id: 'user-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 0, 1, 10).getTime();
    });

    await expect(
      createAppoitment.execute({
        date: new Date(2020, 0, 2, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppoitment.execute({
        date: new Date(2020, 0, 2, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
