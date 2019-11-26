import { Length } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  name: string;

  @Column({length: 100})
  email: string;

  @Column('timestamp without time zone')
  datetime: Date;

  @Column({length: 100})
  clinicName: string;
}
