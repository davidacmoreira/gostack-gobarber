import AppError from '@shared/errors/AppError';

import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let createAppoitment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    createAppoitment = new CreateAppointmentService(fakeAppoitmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppoitment.execute({
      date: new Date(),
      provider_id: '1234567890',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234567890');
  });

  it('should not be able to create two appointments on the same time', async () => {
    await createAppoitment.execute({
      date: new Date(),
      provider_id: '1234567890',
    });

    await expect(
      createAppoitment.execute({
        date: new Date(),
        provider_id: '1234567890',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
