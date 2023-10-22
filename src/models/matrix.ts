import { Row } from './row';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Entity,
  Column,
} from 'typeorm';

@Entity('matrix')
export class Matrix {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  size: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'boolean', nullable: false })
  is_mutation: boolean;

  @OneToMany(() => Row, (rows) => rows.matrix)
  rows: Row[];
}
