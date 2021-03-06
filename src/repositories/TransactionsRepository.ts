import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface CreateTransactionDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (acc, transaction) => {
        acc[transaction.type] += transaction.value;
        return acc;
      },
      { income: 0, outcome: 0 },
    );

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public validBalance({ title, value, type }: CreateTransactionDTO): boolean {
    const balance = this.getBalance();
    return type === 'outcome' && value > balance.total;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
