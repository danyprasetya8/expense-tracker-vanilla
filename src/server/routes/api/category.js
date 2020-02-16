const express = require('express')
const router = express.Router()
const Category = require('../../models/category')

//GET ALL
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
})

//GET SINGLE
router.get('/:id', getCategory, (req, res) => {
  res.json(res.category)
})

//POST
router.post('/', async (req, res) => {
  const category = new Category({
    category: req.body.category
  })
  try {
    const newCategory = await category.save()
    res.status(200).json(newCategory) 
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
})

//UPDATE
router.patch('/:id', async (req, res) => {
  try {
    const category = {
      category: req.body.name
    }
    const updated = await Category.updateOne({ _id: req.params.id }, { $set: { ...category } })
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
})

//DELETE
router.delete('/:id', getCategory, async (req, res) => {
  try {
    await res.category.remove()
    res.status(200).json({ msg: 'Deleted category' })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
})

async function getCategory (req, res, next) {
  let category
  try {
    category = await Category.findById(req.params.id)
    if (category === null) {
      return res.status(400).json({ msg: 'Category not exist' })
    }
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
  res.category = category
  next()
} 


module.exports = router