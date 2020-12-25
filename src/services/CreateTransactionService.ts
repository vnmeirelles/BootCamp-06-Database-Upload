import AppError from '../errors/AppError';
import  {getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
interface Request{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({title, value, type, category}:Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const {total} = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value){
      throw new AppError("You don't have enough balance.");
    }

    let transactionCategory = await categoryRepository.findByCategory(category);

    if (!transactionCategory){
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({title, value, type, category: transactionCategory});

    await transactionsRepository.save(transaction);

    return transaction;

  }
}

export default CreateTransactionService;
