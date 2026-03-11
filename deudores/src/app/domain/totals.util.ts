import { DebtItem } from './models';

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function calcItemTotal(qty: number, unitPrice: number): number {
  const q = Number(qty) || 0;
  const p = Number(unitPrice) || 0;
  return round2(q * p);
}

export function calcDebtTotals(items: Pick<DebtItem, 'qty' | 'unitPrice'>[]) {
  const total = round2(items.reduce((s, it) => s + calcItemTotal(it.qty, it.unitPrice), 0));
  return { total, balance: total };
}
