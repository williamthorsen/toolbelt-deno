export function toOrdinal(int: number): string {
  const modulus = int % 10;
  const endingsMap = {
    0: 'th',
    1: 'st',
    2: 'nd',
    3: 'rd',
  } as { [key: number]: string };
  const ending = [1, 2, 3].includes(modulus) ? endingsMap[modulus] : endingsMap[0];
  return `${int}${ending}`;
}
