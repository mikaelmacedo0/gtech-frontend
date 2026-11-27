const router = require('express').Router()
const categories = require('../controllers/categoryController')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

router.get('/search', categories.search)
router.get('/:id', categories.getById)
router.post('/', authenticate, authorizeAdmin, categories.create)
router.put('/:id', authenticate, authorizeAdmin, categories.update)
router.delete('/:id', authenticate, authorizeAdmin, categories.remove)

module.exports = router
