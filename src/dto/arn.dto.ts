import { IsSquareMatrix } from '../validation/is-square-matrix';

export class ArnDTO {
  @IsSquareMatrix()
  arn: string[][];
}
