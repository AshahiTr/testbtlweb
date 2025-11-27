import { Transaction, TransactionStats } from '../redux/transactionsSlice';
import { mockTransactions, delay } from './mockData';

const TRANSACTIONS_KEY = 'library_transactions';

const initTransactions = () => {
  if (!localStorage.getItem(TRANSACTIONS_KEY)) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mockTransactions));
  }
};

const getStoredTransactions = (): Transaction[] => {
  initTransactions();
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getTransactions = async (): Promise<Transaction[]> => {
  await delay(300);
  return getStoredTransactions();
};

export const createBorrow = async (data: {
  readerId: string;
  bookId: string;
  dueDate: string;
}): Promise<Transaction> => {
  await delay(300);
  const transactions = getStoredTransactions();
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    readerId: data.readerId,
    bookId: data.bookId,
    borrowDate: new Date().toISOString(),
    dueDate: data.dueDate,
    returnDate: null,
    status: 'borrowed',
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const createReturn = async (transactionId: string): Promise<Transaction> => {
  await delay(300);
  const transactions = getStoredTransactions();
  const transaction = transactions.find(t => t.id === transactionId);
  if (transaction) {
    transaction.returnDate = new Date().toISOString();
    transaction.status = 'returned';
    saveTransactions(transactions);
    return transaction;
  }
  throw new Error('Transaction not found');
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
  await delay(300);
  const transactions = getStoredTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  if (index !== -1) {
    transactions[index] = transaction;
    saveTransactions(transactions);
  }
  return transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await delay(300);
  const transactions = getStoredTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
};

export const getStats = async (): Promise<TransactionStats> => {
  await delay(300);
  return {
    weekly: [],
    monthly: [],
    byReader: [],
  };
};
