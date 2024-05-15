var express = require("express");
var router = express.Router();

const productController = require("../../controllers/api/productsController");
const orderController = require("../../controllers/api/productsController");

router.get("/home", productController.index);
router.get("/product/:productId", productController.productDetails);
router.post("/product/new", productController.createProduct);

//user section
router.post("/", productController.createUser);
router.post("/login", productController.userLogin);

router.get("/order/:orderId", orderController.getOrder);

//userId passedinto it to get order to reflect cart status
router.get("/:userId", productController.getUserOrders);

// ! Need to think better routes
//create orderline
router.post("/order/new/:userId", orderController.createOrder);
router.post("/:orderId/orderLine/:productId", orderController.createOrderLine);

// router.get("/products", productController.productListing);
// router.get("/checkin/", productController.getUserByOrderId);
router.get("/checkout/:orderId", productController.getUserByOrderId);
module.exports = router;