import * as fetchApi from '../../views/fetch-api'

const moment = require('moment')

const totalBalanceEl = document.querySelector('.balance-total')
const incomeValueEl = document.querySelector('.income-value')
const expenseValueEl = document.querySelector('.expense-value')
const historyListEl = document.querySelector('.history-list')
/**---------------------------TRANSACTION DOM----------------------------- */
const descValueEl = document.querySelector('#text-value')
const amountValueEl = document.querySelector('#amount-value')
const categoryValueEl = document.querySelector('#category-value')
const editCategoryValueEl = document.querySelector('#edit-category-value')
const formEl = document.querySelector('.add-transaction-container')
/**-----------------------FORM TRANSACTION---------------------------------- */
const validationEl = document.querySelector('.validation')
/**------------------------------------------------------------------------- */
const currDateEl = document.querySelector('#curr-date')
/**------------------------------------------------------------------------- */
const addCategoryInput = document.querySelector('#add-category-input')
const categoryErrorMsgEl = document.querySelector('.category-error-msg')
const addCategoryEl = document.querySelector('.add-category')
/**--------------------------ADD CATEGORY MODAL------------------------------ */
const categoryModalEl = document.querySelector('.category-modal')
const editTransactionModalEl = document.querySelector('.edit-transaction-modal')
const transparentLayerCategoryEl = document.querySelector('.transparent-layer-category')
const transparentLayerEditTransactionEl = document.querySelector('.transparent-layer-edit-transaction')
/**------------------------SHOW / HIDE MODAL---------------------------------- */
const categoryEditEl = document.querySelector('#edit-category-value')
const descEditEl = document.querySelector('#edit-text-value')
const amountEditEl = document.querySelector('#edit-amount-value')
/**-----------------------EDIT TRANSACTION MODAL---------------------------- */

const TRANSACTION_URL = 'http://localhost:5001/transactions/'
const CATEGORY_URL = 'http://localhost:5001/categories/'
// const DEFAULT_CATEGORY = ['SALARY', 'FOOD', 'TRANSPORTATION']
let balanceList = []
let categoryList = []
let date = null

date = moment().format('DD MMMM YYYY')
currDateEl.innerHTML = date

function generateCategoryList (type = '') {
  const el = type === 'edit' ? editCategoryValueEl : categoryValueEl
  el.innerHTML = ''
  fetchApi.getAllViaApi(CATEGORY_URL)
    .then(resp => {
      categoryList = [...resp]
      categoryList.forEach(({ category }) => {
        const categoryEl = document.createElement('option')
        categoryEl.value = category.toUpperCase()
        categoryEl.style.textTransform = 'capitalize'
        categoryEl.innerHTML = category.toLowerCase()
        el.appendChild(categoryEl)
      })
    })
}

function curencyFormat (value) {
  return String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

function filterBalance (type) {
  const filtered = balanceList.filter(i => i.type === type)
  return filtered.length ? filtered.reduce((acc, curr) => acc + Math.abs(curr.amount), 0) : 0
}

function createHistoryDOM () {
  historyListEl.innerHTML = ''
  balanceList.forEach(item => {
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
    icon.addEventListener('click', () => deleteTransaction(item._id))
    history.addEventListener('click', () => showEditTransactionModal(item))
    history.appendChild(text)
    history.appendChild(amount)
    wrapper.appendChild(icon)
    wrapper.appendChild(history)
    historyListEl.appendChild(wrapper)
  })
}

function updateDOM () {
  fetchApi.getAllViaApi(TRANSACTION_URL)
    .then(resp => {
      balanceList = [...resp]
      const totalBalance = balanceList.reduce((acc, curr) => acc + curr.amount, 0)
      const income = curencyFormat(filterBalance('income'))
      const expense = curencyFormat(filterBalance('expense'))
      totalBalanceEl.innerHTML = `$${curencyFormat(totalBalance)}`
      incomeValueEl.innerHTML = `$${income}`
      expenseValueEl.innerHTML = `$${expense}`
      createHistoryDOM()
    })
}

function validateType(val) {
  if (val < 0) return 'expense'
  else return 'income'
}

function closeModal (type) {
  const el = type === 'category' ? categoryModalEl : editTransactionModalEl
  const layer = type === 'category' ? transparentLayerCategoryEl : transparentLayerEditTransactionEl
  el.classList.remove('show-modal')
  layer.classList.remove('show')
}

function showModal (el, layer) {
  el.classList.add('show-modal')
  layer.classList.add('show')
}

function showEditTransactionModal ({ _id }) {
  showModal(editTransactionModalEl, transparentLayerEditTransactionEl)
  fetchApi.getOneViaApi(TRANSACTION_URL, _id)
    .then(resp => {
      generateCategoryList('edit')
      categoryEditEl.value = resp.category
      descEditEl.value = resp.desc
      amountEditEl.value = resp.amount
      editTransactionModalEl.addEventListener('submit', (e) => updateTransaction(e, resp))
    })
}

function createTransactionObj () {
  const desc = descValueEl.value
  const amount = +amountValueEl.value
  const category = categoryValueEl.value
  const type = validateType(amountValueEl.value)
  return { desc, amount, category, type, date }
}

function addNewCategory (e) {
  e.preventDefault()
  const newCategory = {
    category: addCategoryInput.value
  }
  categoryErrorMsgEl.style.display = 'none'
  if (newCategory.category !== '') {
    fetchApi.postViaApi(CATEGORY_URL, newCategory)
      .then(() => {
        generateCategoryList()
        closeModal('category')
      })
  } else {
    categoryErrorMsgEl.style.display = 'block'
  }
  addCategoryInput.value = ''
}

function updateTransaction (e, found) {
  e.preventDefault()
  const temp = { ...found }
  temp.category = categoryEditEl.value
  temp.desc = descEditEl.value
  temp.amount = amountEditEl.value
  fetchApi.updateViaApi(TRANSACTION_URL, temp)
    .then(() => {
      updateDOM()
      closeModal('edit')
    })
}

function deleteTransaction (id) {
  fetchApi.deleteViaApi(TRANSACTION_URL, id)
    .then(() => {
      updateDOM()
    })
}

function addNewTransaction (e) {
  e.preventDefault()
  if (amountValueEl.value.length && categoryValueEl.value.length) {
    const obj = createTransactionObj()
    fetchApi.postViaApi(TRANSACTION_URL, obj)
      .then(() => {
        updateDOM()
        descValueEl.value = ''
        amountValueEl.value = ''
      })
  } else {
    validationEl.classList.add('show-validation')
    setTimeout(() => validationEl.classList.remove('show-validation'), 1500)
  }
}

formEl.addEventListener('submit', addNewTransaction)
categoryModalEl.addEventListener('submit', addNewCategory)
addCategoryEl.addEventListener('click', () => showModal(categoryModalEl, transparentLayerCategoryEl))

window.closeModal = (type) => closeModal(type)

generateCategoryList()
updateDOM()