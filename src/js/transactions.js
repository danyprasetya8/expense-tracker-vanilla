const moment = require('moment')

const totalBalanceEl = document.querySelector('.balance-total')
const incomeValueEl = document.querySelector('.income-value')
const expenseValueEl = document.querySelector('.expense-value')
const historyListEl = document.querySelector('.history-list')
/**------------------------------------------------------------------------- */
const descValueEl = document.querySelector('#text-value')
const amountValueEl = document.querySelector('#amount-value')
const categoryValueEl = document.querySelector('#category-value')
const formEl = document.querySelector('.add-transaction-container')
/**------------------------------------------------------------------------- */
const validationEl = document.querySelector('.validation')
/**------------------------------------------------------------------------- */
const currDateEl = document.querySelector('#curr-date')
/**------------------------------------------------------------------------- */
const categoryModalEl = document.querySelector('.category-modal')
const addCategoryInput = document.querySelector('#add-category-input')
const categoryErrorMsgEl = document.querySelector('.category-error-msg')
const addCategoryEl = document.querySelector('.add-category')
const transparentLayerEl = document.querySelector('.transparent-layer')
const editTransactionModalEl = document.querySelector('.edit-transaction-modal')
/**------------------------------------------------------------------------- */

const DEFAULT_CATEGORY = ['SALARY', 'FOOD', 'TRANSPORTATION']
let balanceList = []
let date = null
let categoryList = [...DEFAULT_CATEGORY]

date = moment().format('DD MMMM YYYY')
currDateEl.innerHTML = date

function generateTransactionId ({ desc, amount, category, type, date }) {
  return `${desc}$${amount}$${category}$${type}$${date}`
}

function generateCategoryList () {
  categoryValueEl.innerHTML = ''
  categoryList.forEach(category => {
    const categoryEl = document.createElement('option')
    categoryEl.value = category.toUpperCase()
    categoryEl.style.textTransform = 'capitalize'
    categoryEl.innerHTML = category.toLowerCase()
    categoryValueEl.appendChild(categoryEl)
  })
}

function curencyFormat (value) {
  return String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

function filterBalance (type) {
  const filtered = balanceList.filter(i => i.type === type)
  return filtered.length ? filtered.reduce((acc, curr) => acc + Math.abs(curr.amount), 0) : 0
}

function deleteItem (idx) {
  const temp = balanceList.filter((i, index) => index !== idx)
  balanceList = [...temp]
  updateDOM()
  window.localStorage.setItem('balanceList', JSON.stringify(balanceList))
}

function createHistoryDOM () {
  historyListEl.innerHTML = ''
  balanceList.forEach((item, idx) => {
    const type = validateType(item.amount)
    const wrapper = document.createElement('div')
    const icon = document.createElement('div')
    const history = document.createElement('div')
    const text = document.createElement('span')
    const amount = document.createElement('span')
    wrapper.classList.add('history-wrapper')
    icon.classList.add('cross-icon')
    history.classList.add('history', type)
    text.style.textTransform = 'capitalize'
    text.innerHTML = `${item.category.toLowerCase()} ${item.desc}`
    amount.innerHTML = item.amount
    icon.addEventListener('click', () => deleteItem(idx))
    history.addEventListener('click', () => editTransaction(item))
    history.appendChild(text)
    history.appendChild(amount)
    wrapper.appendChild(icon)
    wrapper.appendChild(history)
    historyListEl.appendChild(wrapper)
  })
}

function updateDOM () {
  const totalBalance = balanceList.reduce((acc, curr) => acc + curr.amount, 0)
  const income = curencyFormat(filterBalance('income'))
  const expense = curencyFormat(filterBalance('expense'))
  totalBalanceEl.innerHTML = `$${curencyFormat(totalBalance)}`
  incomeValueEl.innerHTML = `$${income}`
  expenseValueEl.innerHTML = `$${expense}`
  createHistoryDOM()
}

function validateType(val) {
  if (val < 0) return 'expense'
  else return 'income'
}

function closeModal (type) {
  const el = type === 'category' ? categoryModalEl : editTransactionModalEl
  el.classList.remove('show-modal')
  transparentLayerEl.classList.remove('show')
}

function showModal (el) {
  el.classList.add('show-modal')
  transparentLayerEl.classList.add('show')
}

function editTransaction ({ id }) {
  showModal(editTransactionModalEl)
}

function createTransactionObj () {
  const desc = descValueEl.value
  const amount = +amountValueEl.value
  const category = categoryValueEl.value
  const type = validateType(amountValueEl.value)
  const obj = { desc, amount, category, type, date }
  return {
    id: generateTransactionId(obj),
    ...obj
  }
}

function addNewCategory (e) {
  e.preventDefault()
  const newCategory = addCategoryInput.value
  categoryErrorMsgEl.style.display = 'none'
  if (newCategory !== '') {
    categoryList.push(newCategory)
    generateCategoryList()
    closeModal('category')
  } else {
    categoryErrorMsgEl.style.display = 'block'
  }
  addCategoryInput.value = ''
}

function addNewTransaction (e) {
  e.preventDefault()
  if (amountValueEl.value.length && categoryValueEl.value.length) {
    const obj = createTransactionObj()
    console.log(obj)
    balanceList.push(obj)
    updateDOM()
    descValueEl.value = ''
    amountValueEl.value = ''
    window.localStorage.setItem('balanceList', JSON.stringify(balanceList))
  } else {
    validationEl.classList.add('show-validation')
    setTimeout(() => validationEl.classList.remove('show-validation'), 1500)
  }
}

function getLocalStorage () {
  const storageBalanceList = window.localStorage.getItem('balanceList')
  const parsedBalanceList = JSON.parse(storageBalanceList) || []
  balanceList = [...parsedBalanceList]
  updateDOM()
}

formEl.addEventListener('submit', addNewTransaction)
categoryModalEl.addEventListener('submit', addNewCategory)
addCategoryEl.addEventListener('click', () => showModal(categoryModalEl))

window.closeModal = (type) => closeModal(type)

getLocalStorage()
generateCategoryList()