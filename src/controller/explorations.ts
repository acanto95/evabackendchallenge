import { BaseContext } from 'koa';
import moment from 'moment';
import { getManager, LessThan, Not, Repository, MoreThan, Between, In } from 'typeorm';
import { Explorations } from '../entity/explorations';
import { Bookings } from '../entity/bookings';


export default class ExplorationsController {
  public static async getExplorations(ctx: BaseContext) {

    const explorationRepo: Repository<Explorations> = getManager().getRepository(Explorations);
    const bookingsRepo: Repository<Bookings> = getManager().getRepository(Bookings);
    let initialFram = ctx.request.query.start;
    let endFrame = ctx.request.query.end;
    let clinicName = ctx.request.query.clinicName;
    const query = {};
    const formatDate = moment().format('YYYY-MM-DD');


    if (initialFram === undefined) {
      initialFram = formatDate;
    }
    if (ctx.request.query.end === undefined) {
      endFrame = moment(formatDate, 'YYYY-MM-DD').add('days', 5);
    }

    if (clinicName === undefined) {
      clinicName = true;
    }

    // TODO: Falta validacion cuando nombre esta vacio; checar si puedes hacer query multiple con const query

    /* if (schema && schema !== 'all') {
      query['schema'] = schema;
    } */

    const bookings: Bookings[] = await bookingsRepo.find({ datetime: Between(initialFram, endFrame),
    clinicName: clinicName});

  const ids = bookings.map((b) => b.id);

    const explorations: Explorations[] = await explorationRepo.find({
      bookingId: In(ids)
    });

    ctx.status = 200;
    ctx.body = explorations;
  }

  public static async getBookings(ctx: BaseContext) {

    const bookingsRepo: Repository<Bookings> = getManager().getRepository(Bookings);
    const query = {};
    /* if (schema && schema !== 'all') {
      query['schema'] = schema;
    } */

    const booking: Bookings[] = await bookingsRepo.find();

    ctx.status = 200;
    ctx.body = booking;
  }


}