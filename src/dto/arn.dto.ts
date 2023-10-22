import { IsSquareMatrix } from 'src/validation/is-square-matrix';

export class ArnDTO {
  @IsSquareMatrix()
  arn: string[][];
}
