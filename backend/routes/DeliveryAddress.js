const { addDeliveryAddress, getDeliveryAddress, updateDeliveryAddress } = require("../controllers/DeliveryAddressController");
const { EnsureAuthenticated } = require("../middleware/EnsureAuthenticated");

const router = require("express").Router();

router.post("/:userId/add/delivery-address",EnsureAuthenticated,addDeliveryAddress)
router.get("/:userId/delivery-address",EnsureAuthenticated,getDeliveryAddress)
router.put("/:userId/update/delivery-address",EnsureAuthenticated,updateDeliveryAddress)


module.exports = router