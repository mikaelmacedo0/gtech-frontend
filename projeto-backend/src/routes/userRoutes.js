const router = require('express').Router()
const users = require('../controllers/userController')
const { authenticate } = require('../middleware/auth')

router.get('/:id', users.getById)
router.post('/', users.create)
router.put('/:id', authenticate, users.update)
router.delete('/:id', authenticate, users.remove)

module.exports = router
