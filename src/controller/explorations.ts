import { BaseContext } from 'koa';
import moment from 'moment';
import { getManager, LessThan, Not, Repository, MoreThan, Between, In } from 'typeorm';
import { Explorations } from '../entity/explorations';
import { Bookings } from '../entity/bookings';


export default class ExplorationsController {
  public static async getExplorations(ctx: BaseContext) {

    if(!ctx.state.user.team || ctx.state.user.team !== 'data-science') {
      ctx.status = 400;
      ctx.body = {message: 'Your user is not allowed to access this information'};
      return;
    }

    const explorationRepo: Repository<Explorations> = getManager().getRepository(Explorations);
    const bookingsRepo: Repository<Bookings> = getManager().getRepository(Bookings);
    const initialFram = ctx.request.query.start;
    let endFrame = ctx.request.query.end;
    const clinicName = ctx.request.query.clinicName;
    const query = {};
    const queryBookings = {};
    const formatDate = moment().format('YYYY-MM-DD');

    if (initialFram !== undefined && endFrame !== undefined) {
      if (initialFram > endFrame) {
        ctx.status = 400;
      ctx.body = {message: 'The start date is greater than the end date'};
      return;
      }
      query['datetime'] = Between(initialFram, endFrame);
    }


    if (initialFram === undefined && endFrame !== undefined) {
      query['datetime'] = LessThan(endFrame);
    }

    if (endFrame === undefined && initialFram !== undefined) {
      endFrame = moment(formatDate, 'YYYY-MM-DD').add('days', 5);
      query['datetime'] = MoreThan(initialFram);
    }

    if (clinicName !== undefined) {
      query['clinicName'] = clinicName;
    }

    const bookings: Bookings[] = await bookingsRepo.find(query);

    const ids = bookings.map((b) => b.id);

    queryBookings['bookingId'] = In(ids);

    let explorations: Explorations[] = await explorationRepo.find(queryBookings);


    if (ctx.request.body.medicationsAll !== undefined){
       const medications = ctx.request.body.medicationsAll;
       explorations = explorations.filter((e) => JSON.stringify(e.consumedMedications.replace(/[\[\]']+/g, '').trim().split(',')) === JSON.stringify(medications) );
    }
    if (ctx.request.body.medicationsSome !== undefined) {
       const medications = ctx.request.body.medicationsSome;
       explorations = explorations.filter((e) => e.consumedMedications.replace(/[\[\]']+/g, '').trim().split(',').some((c) =>  medications.indexOf(c) !== -1));
    }

    explorations = explorations.map((b) => {
      const booking = bookings.find((e) => e.id === b.bookingId);
      b['name'] = booking.name;
      b['email'] = booking.email;
      b['datetime'] = booking.datetime;
      b['clinicName'] = booking.clinicName;
      return b;
    });

    ctx.status = 200;
    ctx.body = explorations;
  }

}