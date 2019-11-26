import { BaseContext } from 'koa';
import moment from 'moment';
import { getManager, LessThan, Not, Repository, MoreThan, Between, In } from 'typeorm';
import { Explorations } from '../entity/explorations';
import { Bookings } from '../entity/bookings';


export default class ExplorationsController {
  public static async getExplorations(ctx: BaseContext) {

    const explorationRepo: Repository<Explorations> = getManager().getRepository(Explorations);
    const bookingsRepo: Repository<Bookings> = getManager().getRepository(Bookings);
    const initialFram = ctx.request.query.start;
    let endFrame = ctx.request.query.end;
    const clinicName = ctx.request.query.clinicName;
    console.log(ctx.request.body.medications);
    const query = {};
    const queryBookings = {};
    const formatDate = moment().format('YYYY-MM-DD');

    if (initialFram !== undefined && endFrame !== undefined){
      query['datetime'] = Between(initialFram, endFrame);
    }


    if (initialFram === undefined) {
      /* initialFram = formatDate; */
      query['datetime'] = Between(formatDate, endFrame);
    }
    if (endFrame === undefined) {
      endFrame = moment(formatDate, 'YYYY-MM-DD').add('days', 5);
      query['datetime'] = Between(formatDate, endFrame);
    }

    if (clinicName !== undefined) {
      /* clinicName = true; */
      query['clinicName'] = clinicName;
    }

    const bookings: Bookings[] = await bookingsRepo.find(query);

  const ids = bookings.map((b) => b.id);

    const explorations: Explorations[] = await explorationRepo.find({
      bookingId: In(ids)
    });

    ctx.status = 200;
    ctx.body = explorations;
  } 

}