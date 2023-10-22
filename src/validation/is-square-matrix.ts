import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint()
class IsSquareMatrixContraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }

    const numRows = value.length;

    return value.every(
      (row) =>
        Array.isArray(row) &&
        row.length === numRows &&
        row.every(
          (e) => typeof e === 'string' && e.match(/^[A-Z]+$/) && e.length === 1,
        ),
    );
  }

  defaultMessage({ property }: ValidationArguments) {
    return (
      property +
      ' must be a square matrix of single-character uppercase strings'
    );
  }
}

export function IsSquareMatrix(validationOptions?: ValidationOptions) {
  return function (obj: object, propertyName: string) {
    return registerDecorator({
      validator: IsSquareMatrixContraint,
      propertyName: propertyName,
      options: validationOptions,
      target: obj.constructor,
      constraints: [],
    });
  };
}
