import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import { getIO } from "../utils/socket.js";

// @route POST /api/orders
export const createOrder = async (req, res) => {
  const { items } = req.body || {};

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Please provide at least one item" });
  }

  const orderItems = [];
  let totalPrice = 0;

  // First pass: validate everything and calculate price
  for (const entry of items) {
    const { baseId, sauceId, cheeseId, vegetableIds = [], quantity = 1 } = entry;

    const base = await Inventory.findById(baseId);
    const sauce = await Inventory.findById(sauceId);
    const cheese = await Inventory.findById(cheeseId);

    if (!base || !sauce || !cheese) {
      return res.status(400).json({ message: "Invalid base, sauce, or cheese selected" });
    }

    const vegetables = [];
    for (const vegId of vegetableIds) {
      const veg = await Inventory.findById(vegId);
      if (!veg) {
        return res.status(400).json({ message: `Vegetable not found: ${vegId}` });
      }
      vegetables.push(veg);
    }

    const allSelectedItems = [base, sauce, cheese, ...vegetables];
    for (const item of allSelectedItems) {
      if (item.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.name} to make ${quantity}x pizza`,
        });
      }
    }

    const priceAtOrder =
      (base.price + sauce.price + cheese.price + vegetables.reduce((sum, v) => sum + v.price, 0)) *
      quantity;

    orderItems.push({
      base: base._id,
      sauce: sauce._id,
      cheese: cheese._id,
      vegetables: vegetables.map((v) => v._id),
      quantity,
      priceAtOrder,
    });

    totalPrice += priceAtOrder;
  }

  // Second pass: all validated, now actually decrement stock
  for (const entry of items) {
    const { baseId, sauceId, cheeseId, vegetableIds = [] } = entry;
    const quantity = entry.quantity || 1;
    const allIds = [baseId, sauceId, cheeseId, ...vegetableIds];

    for (const id of allIds) {
      await Inventory.findByIdAndUpdate(id, { $inc: { stock: -quantity } });
    }
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalPrice,
  });

  res.status(201).json({ message: "Order created", order });
};

// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id })
    .populate("items.base")
    .populate("items.sauce")
    .populate("items.cheese")
    .populate("items.vegetables");
    res.status(200).json(orders);
};

// @route PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    const { orderStatus } = req.body || {};

    const validStatuses = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: "IPlease provide a valid orderStatus" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    const io = getIO();
    io.to(order.user.toString()).emit("orderStatusUpdated", order);

    res.status(200).json({ message: "Order status updated", order });
};