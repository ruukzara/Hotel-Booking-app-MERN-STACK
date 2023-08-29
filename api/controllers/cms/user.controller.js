import { User } from "../../models/index.js";
import { anyError } from "../../lib/index.js";

class customerController {

  // Retrieve customer details
  getUser = async (req, res, next) => {
    try {
      const customerId = req.params.id;

      // Find the customer by ID
      const customer = await User.findById(customerId);

      if (!customer) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(customer);
    } catch (error) {
      next({
        message: 'Problem while processing request.',
        status: 400,
      })
    }
  }

  getAllUsers = async (req, res, next) => {
    try {
        const customers = await User.find().populate('reviews').exec();

        res.json(customers);
    } catch (err) {
        anyError(err, next);
    }
}

  // Update customer details
  updateUser = async (req, res, next) => {
    try {
      const customerId = req.params.id;
      const { name, phone, address, status } = req.body;

      // Find the customer by ID and update the details
      const updatedUser = await User.findByIdAndUpdate(
        customerId,
        { name, phone, address, status },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        success: 'Staff Updated.'
    })
    } catch (error) {
      anyError(error, next);
    }
  }

  // Delete a customer
  deleteUser = async (req, res, next) => {
    try {
      const customerId = req.params.id;

      // Find the customer by ID and delete
      const deletedUser = await User.findByIdAndDelete(customerId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      anyError(error, next);
    }
  }
}

export default new customerController