const router = require('express').Router()
const products = require('../controllers/productControllerV1')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

router.get('/search', products.search)
router.get('/:id', products.getById)
router.post('/', authenticate, authorizeAdmin, products.create)
router.put('/:id', authenticate, authorizeAdmin, products.update)
router.delete('/:id', authenticate, authorizeAdmin, products.remove)

module.exports = router
