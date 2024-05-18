const Data = require("../../models/order");
const { User } = require("../../models/user");

const updateOrder = async (req, res) => {
  try {
    await Data.Order.updateOne(
      {
        "orderLine.product_id": req.body.product_id,
        // "orderLine._id": req.body._id,
      },
      {
        $set: {
          "orderLine.$.orderQty": req.body.orderQty,
        },
      },
    );

    const testing456 = await Data.Order.findOne({
      "orderLine.product_id": req.body.product_id,
      "orderLine._id": req.body._id,
    }).populate({
      path: "orderLine.product_id",
      model: "Product",
    });
    return res.status(201).json(testing456);
    // .json({ message: "Order created successfully", testing123 });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createOrderLine = async (req, res) => {
  const { orderId } = req.params;
  const body = req.body;
  const Order = await Data.Order.findById(orderId);
  Order.orderLine.push(body);
  Order.save();
  const newData = await Data.Order.findById({ _id: orderId }).populate({
    path: "orderLine.product_id",
    model: "Product",
  });
  res.status(201).json(newData);
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    await Data.Order.updateOne(
      {
        "orderLine.product_id": orderId,
      },
      {
        $pull: {
          orderLine: { product_id: orderId },
        },
      },
    );
    res
      .status(201)
      .json({ message: `Product ID ${orderId} Deleted Successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

const getOrder = async (req, res) => {
  const products = await Data.Order.find({}).populate({
    path: "orderLine.product_id",
    model: "Product",
  });
  res.status(201).json(products);
};

const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  console.log("this", userId);
  try {
    const User = await Data.Order.find({ user_id: userId }).populate({
      path: "orderLine.product_id",
      model: "Product",
    });
    console.log("157", User);

    const findIndex = User.findIndex((items) => items.paidStatus === false);

    if (User.length === 0 || findIndex === -1) {
      const newOrder = await Data.Order.create({});
      newOrder.user_id = userId;
      newOrder.save();
      console.log("here?", newOrder);
      res.status(201).json([newOrder]);
    } else {
      res.status(201).json(User);
    }
    // res.redirect(301, "new-url");
  } catch (error) {
    console.log("here is the err", error);
    res.status(401).json({ error });
  }
};
//get user id and details
const getUserByOrderId = async (req, res) => {
  const { orderId } = req.params;
  console.log("testhere");
  try {
    const order = await Data.Order.findById(orderId).populate("user_id");
    if (!order) {
      console.log(`Order not found for orderId: ${orderId}`);
      return res.status(404).json({ message: "Order not found" });
    }
    console.log(`Order found: ${order}`);
    res.status(200).json(order.user_id);
  } catch (error) {
    console.error(`Error fetching user by order ID: ${error}`);
    res.status(500).json({ message: "Error fetching user by order ID" });
  }
};
//updates the order and user data when place order button is pushed
const updateOrderPaid = async (req, res) => {
  const { orderId, userId } = req.params;
  console.log(orderId, userId);
  const updatedData = { paidStatus: true, ...req.body };

  try {
    const updatedOrder = await Data.Order.findByIdAndUpdate(
      orderId,
      updatedData,
      { new: true },
    );
    if (!updatedOrder) {
      return res.status(500).json({ message: "Error updating order" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { orders: orderId } },
      { new: true },
    );
    console.log("results,", user);
    if (!user) {
      return res.status(500).json({ message: "Error updating user" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order" });
  }
};
const getUserOrdersById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Data.User.findById(userId, "orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user orders" });
  }
};

module.exports = {
  updateOrder,
  createOrderLine,
  deleteOrder,
  getOrder,
  getUserOrders,
  getUserByOrderId,
  updateOrderPaid,
  getUserOrdersById,
};
