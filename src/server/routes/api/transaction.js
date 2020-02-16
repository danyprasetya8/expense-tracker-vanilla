const express = require('express')
const router = express.Router()
const Transaction = require('../../models/transaction')

//GET
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
    res.status(200).json(transactions)
  } catch (error) {
    res.status(400).json(error)
  }
})

//GET SINGLE TRANSACTION
router.get('/:id', getTransaction, (req, res) => {
  res.json(res.transaction)
})

//POST
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    desc: req.body.desc,
    amount: req.body.amount,
    category: req.body.category,
    type: req.body.type,
    date: req.body.date
  })
  
  try {
    const newTransaction = await transaction.save()
    res.status(201).json(newTransaction)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
})

//UPDATE
router.patch('/:id', async (req, res) => {
  try {
    const transaction = {
      desc: req.body.desc,
      amount: req.body.amount,
      category: req.body.category,
      type: req.body.type,
      date: req.body.date
    }
    const updated = await Transaction.updateOne({ _id: req.params.id }, { $set: { ...transaction } })
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
})

//DELETE
router.delete('/:id', getTransaction, async (req, res) => {
  try {
    await res.transaction.remove()  
    res.json({ msg: 'Deleted transaction' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
})

async function getTransaction (req, res, next) {
  let transaction
  try {
    transaction = await Transaction.findById(req.params.id)
    if (transaction === null) {
      return res.status(404).json({ msg: 'Cannot find transaction' })
    }
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
  res.transaction = transaction
  next()
}

module.exports = router