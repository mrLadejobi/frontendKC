export interface User {
  name: string;
  accountNumber: string;
}

export interface BalanceResponse {
  balance: number;
  name?: string;
  accountNumber?: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
  id: number;
}
