export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export function getQuarterFromMonth(month: number): number {
  return Math.ceil(month / 3);
}

export function getMonthsInQuarter(quarter: number): number[] {
  const startMonth = (quarter - 1) * 3 + 1;
  return [startMonth, startMonth + 1, startMonth + 2];
}

export function getQuarterLabel(quarter: number): string {
  return QUARTERS[quarter - 1];
}

export function getMonthLabel(month: number): string {
  return MONTHS[month - 1];
}

export function calculateFeatureWidth(startMonth: number, endMonth: number): number {
  return ((endMonth - startMonth + 1) / 12) * 100;
}

export function calculateFeatureOffset(startMonth: number): number {
  return ((startMonth - 1) / 12) * 100;
}

export function getMonthFromPosition(position: number, containerWidth: number): number {
  const percentage = position / containerWidth;
  const month = Math.round(percentage * 12) + 1;
  return Math.max(1, Math.min(12, month));
}