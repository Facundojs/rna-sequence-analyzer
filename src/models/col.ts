import { Row } from './row';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
} from 'typeorm';

@Entity('col')
export class Col {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Row, (rows) => rows.cols, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'row_id' })
  row?: Row;

  @Column({ type: 'int', nullable: false })
  index: number;

  @Column({ type: 'char', length: 1, nullable: false })
  value: string;
}
