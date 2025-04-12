const{updateName, emailVerification, updateEmail} = require("../controllers/EditProfileController");
const { EnsureAuthenticated } = require("../middleware/EnsureAuthenticated");
const { updateEmailValidation } = require("../middleware/updateEmailValidation");

const router = require('express').Router();

router.put("/:userId/update/name", EnsureAuthenticated, updateName)
router.post("/:userId/verify-email", EnsureAuthenticated, emailVerification);
router.put("/:userId/update-email", EnsureAuthenticated, updateEmailValidation, updateEmail);


module.exports = router