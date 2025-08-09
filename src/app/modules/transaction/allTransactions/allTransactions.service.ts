import { AllTransactions } from "./allTransactions.model";


// GET All Transactions
export const getAllTransactions = async () => {
  const transactions = await AllTransactions.find().sort({
    createdAt: -1,
  });

  return transactions;
};

// Get A Transaction //
export const getATransactionsById = async (id: string) => {
  return AllTransactions.findById(id);
};

export const AllTransactionsServices = {
  getAllTransactions,
  getATransactionsById,
};
