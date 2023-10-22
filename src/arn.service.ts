import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Matrix } from './models/matrix';
import { isEven } from './utils/is-even';
import { Arn } from './entities/arn';
import { Repository } from 'typeorm';

@Injectable()
export class ArnService {
  constructor(
    @InjectRepository(Matrix)
    private readonly matrixRepository: Repository<Matrix>,
  ) {}

  create(matrix: Omit<Matrix, 'id'>) {
    return this.matrixRepository.save(matrix);
  }

  async stats() {
    const [total, mutated] = await Promise.all([
      this.matrixRepository.count(),
      this.matrixRepository.count({ where: { is_mutation: true } }),
    ]);

    return {
      ratio: mutated / total,
      mutated,
      total,
    };
  }

  isMutationdArn(arn: Arn): boolean {
    const leftDiagonal = arn.map((row, index) => row[arn.length - 1 - index]);

    const charsCounter = leftDiagonal.reduce(
      (acc, row) => {
        if (!acc[row]) acc[row] = 1;
        else acc[row] += 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    return Object.values(charsCounter).some((count) => isEven(count));
  }
}
