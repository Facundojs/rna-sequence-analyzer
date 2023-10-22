import { isEven } from './is-even';

describe('isEven', () => {
  it('should return true if number is even', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(4)).toBe(true);
    expect(isEven(6)).toBe(true);
    expect(isEven(8)).toBe(true);
    expect(isEven(10)).toBe(true);
  });

  it('should return false if number is odd', () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(3)).toBe(false);
    expect(isEven(5)).toBe(false);
    expect(isEven(7)).toBe(false);
    expect(isEven(9)).toBe(false);
  });
});
