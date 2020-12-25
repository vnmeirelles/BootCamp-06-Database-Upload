import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
   public async getBalance(): Promise<Balance> {
    const { sum: sumIncome } = await this.createQueryBuilder().select('SUM(value)').where({type: 'income',}).getRawOne();
    const { sum: sumOutcome } = await this.createQueryBuilder().select('SUM(value)').where({type: 'outcome',}).getRawOne();

    const income: number = parseFloat(sumIncome) || 0.00;
    const outcome: number = parseFloat(sumOutcome) || 0.00;
    const total: number = income - outcome;

    return {income,outcome,total,};

   }
}

export default TransactionsRepository;
