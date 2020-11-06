import FakeAppoitmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppoitmentRepository = new FakeAppoitmentRepository();
    const createAppoitment = new CreateAppointmentService(
      fakeAppoitmentRepository,
    );

    const appointment = await createAppoitment.execute({
      date: new Date(),
      provider_id: '1234567890',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234567890');
  });
});
