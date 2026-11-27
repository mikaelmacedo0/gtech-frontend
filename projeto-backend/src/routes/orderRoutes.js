const router = require('express').Router()
const orders = require('../controllers/orderController')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)
router.post('/', orders.create)
router.get('/', orders.list)
router.get('/:id', orders.getById)

module.exports = router
