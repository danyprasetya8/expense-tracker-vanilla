const moment = require('moment')
import flatpickr from 'flatpickr'
import Chart from 'chart.js'




// HOME PAGE
const tabList = document.querySelectorAll('.tab')
const trasactionTab = document.querySelector('.transactions')
const recordTab = document.querySelector('.records')
window.toggleActiveTab = function (type) {
  tabList.forEach(tab => {
    const { currtab } = tab.dataset
    if (currtab === type) {
      trasactionTab.className = 'transactions'
      recordTab.className = 'records'
      tab.classList.add('active')
      if (type === 'TRANSACTIONS') {
        trasactionTab.classList.add('show-tabs')
      } else {
        recordTab.classList.add('show-tabs')
      }
    } else {
      tab.className = 'tab'
    }
  })
}
tabList[0].click()



// TRANSACTIONS TAB
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
/**------------------------------------------------------------------------- */

let balanceList = []
let date = null
let categoryList = ['SALARY', 'FOOD', 'TRANSPORTATION']

date = moment().format('DD MMMM YYYY')
currDateEl.innerHTML = date

function generateCategoryList () {
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

formEl.addEventListener('submit', (e) => {
  e.preventDefault()
  if (amountValueEl.value.length && categoryValueEl.value.length) {
    const obj = {
      desc: descValueEl.value,
      amount: +amountValueEl.value,
      category: categoryValueEl.value,
      type: validateType(amountValueEl.value),
      date: date
    }
    balanceList.push(obj)
    window.localStorage.setItem('balanceList', JSON.stringify(balanceList))
    updateDOM()
    descValueEl.value = ''
    amountValueEl.value = ''
  } else {
    validationEl.classList.add('show-validation')
    setTimeout(() => validationEl.classList.remove('show-validation'), 1500)
  }
})

categoryModalEl.addEventListener('submit', e => {
  e.preventDefault()
  const newCategory = addCategoryInput.value
  categoryErrorMsgEl.style.display = 'none'
  if (newCategory !== '') {
    categoryList.push(newCategory)
    generateCategoryList()
  } else {
    categoryErrorMsgEl.style.display = 'block'
  }
  addCategoryInput.value = ''
})

function getLocalStorage () {
  const locStorage = window.localStorage.getItem('balanceList')
  const temp = JSON.parse(locStorage) || []
  balanceList = [...temp] || []
  updateDOM()
}

getLocalStorage()
generateCategoryList()





//RECORDS TAB
const ctx = document.querySelector('#records-chart')
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      labels: '# of votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderWidth: 1
    }]
  }
})