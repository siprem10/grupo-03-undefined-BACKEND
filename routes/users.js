const express = require('express')
const {
   getAll,
   getById
} = require('../controllers/users')

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getById)

module.exports = router