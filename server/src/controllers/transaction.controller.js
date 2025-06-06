import Transaction from "../models/transaction.model.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { categoryType, category, amount, date, notes } = req.body;
    const newTransaction = new Transaction({
      user: req.user._id,
      categoryType,
      category,
      amount,
      date,
      notes,
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

export const getBalance = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    const balance = transactions.reduce((total, transaction) => {
      return transaction.categoryType === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
    res.json({ balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating balance", error: error.message });
  }
};
