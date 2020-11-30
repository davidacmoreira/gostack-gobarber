import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllAppointmentsInMonthFromProviderDTO from '../dtos/IFindAllAppointmentsInMonthFromProviderDTO';
import IFindAllAppointmentsInDayFromProviderDTO from '../dtos/IFindAllAppointmentsInDayFromProviderDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllAppointmentsInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllAppointmentsInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
