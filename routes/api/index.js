const express = require('express')
const router = express.Router()
const ctrlContacts = require('../../controller')

router.get('/', ctrlContacts.get)

router.get('/:id', ctrlContacts.getById)

router.post('/', ctrlContacts.create)

router.put('/:id', ctrlContacts.update)
//
// router.patch('/tasks/:id/status', ctrlTask.updateStatus)
//
// router.delete('/tasks/:id', ctrlTask.remove)

module.exports = router
