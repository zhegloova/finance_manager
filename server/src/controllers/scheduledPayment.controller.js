import ScheduledPayment from "../models/scheduledPayment.model.js";

export const getScheduledPayments = async (req, res) => {
  try {
    const payments = await ScheduledPayment.find({ user: req.user._id }).sort({
      date: 1,
    });
    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching scheduled payments",
        error: error.message,
      });
  }
};

export const createScheduledPayment = async (req, res) => {
  try {
    const { date, category, amount } = req.body;
    
    // Преобразуем строковую дату в формат DD.MM.YYYY в объект Date
    const [day, month, year] = date.split('.');
    const paymentDate = new Date(year, month - 1, day);

    const newPayment = new ScheduledPayment({
      user: req.user._id,
      date: paymentDate,
      category,
      amount,
    });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Error creating scheduled payment:', error);
    res
      .status(500)
      .json({
        message: "Error creating scheduled payment",
        error: error.message,
      });
  }
};

export const deleteScheduledPayment = async (req, res) => {
  try {
    const payment = await ScheduledPayment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Scheduled payment not found" });
    }

    res.json({ message: "Scheduled payment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting scheduled payment",
        error: error.message,
      });
  }
};
