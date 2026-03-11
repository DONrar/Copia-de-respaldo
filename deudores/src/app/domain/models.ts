export type ID = string;
export type DebtStatus = 'OPEN' | 'CLOSED';

export interface Debtor {
  id: ID;
  name: string;
  phone?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DebtItem {
  id: ID;
  product: string;
  qty: number;          // cantidad
  unitPrice: number;    // valor unitario
  total: number;        // qty * unitPrice (calculado)
}

export interface Debt {
  id: ID;
  debtorId: ID;
  date: string;         // ISO yyyy-mm-dd
  items: DebtItem[];
  total: number;        // suma de items.total
  paid: number;         // abonos (luego lo usamos)
  balance: number;      // total - paid
  status: DebtStatus;   // 'OPEN' | 'CLOSED'
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Payment {
  id: ID;
  debtorId: ID;
  debtId?: ID;          // opcional si es abono a una deuda específica
  date: string;         // ISO
  amount: number;
  note?: string;
  createdAt: number;
}
