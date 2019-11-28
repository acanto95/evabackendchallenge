import { BaseContext } from 'koa';
import moment from 'moment';
import { getManager, LessThan, Not, Repository, MoreThan, Between, In } from 'typeorm';
import { Explorations } from '../entity/explorations';
import { Bookings } from '../entity/bookings';


export default class ExplorationsController {
  public static async getExplorations(ctx: BaseContext) {

    // authentication only for data team
    if (!ctx.state.user.team || ctx.state.user.team !== 'data-science') {
      ctx.status = 403;
      ctx.body = {message: 'Your user is not allowed to access this information'};
      return;
    }

    const explorationRepo: Repository<Explorations> = getManager().getRepository(Explorations);
    const bookingsRepo: Repository<Bookings> = getManager().getRepository(Bookings);
    const initialFram = ctx.request.query.start;
    let endFrame = ctx.request.query.end;
    let clinicName = ctx.request.query.clinicName;
    const query = {};
    const queryBookings = {};
    const formatDate = moment().format('YYYY-MM-DD');

    // dates validations
    if (initialFram !== undefined && endFrame !== undefined) {
      if (initialFram > endFrame) {
        ctx.status = 400;
      ctx.body = {message: 'The start date is greater than the end date'};
      return;
      }

      if (initialFram === endFrame){
        const init = moment(initialFram).set({hour: 0,minute: 0,second:0,millisecond:0}).format('YYYY-MM-DD:HHmmss');
        const ending = moment(endFrame).set({hour: 23,minute: 58,second:0,millisecond:0}).format('YYYY-MM-DD:HHmmss');
        query['datetime'] = Between(init, ending);
      } else {
        query['datetime'] = Between(initialFram, endFrame);
      }

    }


    if (initialFram === undefined && endFrame !== undefined) {
      query['datetime'] = LessThan(endFrame);
    }

    if (endFrame === undefined && initialFram !== undefined) {
      endFrame = moment(formatDate, 'YYYY-MM-DD').add('days', 5);
      query['datetime'] = MoreThan(initialFram);
    }

    // clinicName validations
    if (clinicName !== undefined) {
      clinicName = clinicName.toUpperCase();
      query['clinicName'] = clinicName;
    }

    const bookings: Bookings[] = await bookingsRepo.find(query);

    // get only ids from bookings
    const ids = bookings.map((b) => b.id);

    queryBookings['bookingId'] = In(ids);

    // find explorations with the bookingIds found
    let explorations: Explorations[] = await explorationRepo.find(queryBookings);

    // filter by body fields (medicationsAll, medicationsSome)
    if (ctx.request.body.medicationsAll !== undefined) {
       const medications = ctx.request.body.medicationsAll;
       explorations = explorations.filter((e) => JSON.stringify(e.consumedMedications.replace(/[\[\]']+/g, '').trim().split(',')) === JSON.stringify(medications) );
    }
    if (ctx.request.body.medicationsSome !== undefined) {
       const medications = ctx.request.body.medicationsSome;
       explorations = explorations.filter((e) => e.consumedMedications.replace(/[\[\]']+/g, '').trim().split(',').some((c) =>  medications.indexOf(c) !== -1));
    }

    // join information
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