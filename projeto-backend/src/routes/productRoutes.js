const router = require('express').Router()
const products = require('../controllers/productController')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

router.get('/', products.list)
router.get('/slug/:slug', products.getBySlug)
router.get('/:id', products.getById)
router.post('/', authenticate, authorizeAdmin, products.create)
router.put('/:id', authenticate, authorizeAdmin, products.update)
router.delete('/:id', authenticate, authorizeAdmin, products.remove)

module.exports = router
