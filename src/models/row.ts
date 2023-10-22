import { Matrix } from './matrix';
import { Col } from './col';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Entity,
  Column,
} from 'typeorm';

@Entity('row')
export class Row {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Matrix, (matrix) => matrix.rows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'matrix_id' })
  matrix?: Matrix;

  @Column({ type: 'int', nullable: false })
  index: number;

  @OneToMany(() => Col, (col) => col.row)
  cols?: Col[];
}
