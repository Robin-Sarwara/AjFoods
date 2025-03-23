const { addItem, deleteCartItem, getCartItems, updateCart } = require('../controllers/CartController');
const { EnsureAuthenticated } = require('../middleware/EnsureAuthenticated');

const router = require('express').Router();

router.post('/product/:id/addtocart', EnsureAuthenticated, addItem)
router.delete('/delete/cart/:cartId/items/:itemId',EnsureAuthenticated,deleteCartItem)
router.get('/:id/cart-items',EnsureAuthenticated, getCartItems)
router.put('/cart/:id/update', EnsureAuthenticated, updateCart)

module.exports = router