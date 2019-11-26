import { Length } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Explorations {
  @PrimaryGeneratedColumn()
    bookingId: number;

    @Column('text', {default: ''})
  consumedMedications: string;


}
