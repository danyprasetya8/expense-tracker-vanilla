const totalBalanceEl = document.querySelector('.balance-total')
const incomeValueEl = document.querySelector('.income-value')
const expenseValueEl = document.querySelector('.expense-value')
const historyListEl = document.querySelector('.history-list')
const textValueEl = document.querySelector('#text-value')
const amountValueEl = document.querySelector('#amount-value')
const formEl = document.querySelector('.add-transaction-container')
const validationEl = document.querySelector('.validation')

let balanceList = []

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
}

function createHistoryDOM () {
  historyListEl.innerHTML = ''
  balanceList.forEach((item, idx) => {
    const wrapper = document.createElement('div')
    const icon = document.createElement('div')
    const history = document.createElement('div')
    const text = document.createElement('span')
    const amount = document.createElement('span')
    wrapper.classList.add('history-wrapper')
    icon.classList.add('cross-icon')
    history.classList.add('history')
    text.innerHTML = item.desc
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
  if (textValueEl.value.length && amountValueEl.value.length) {
    const obj = {
      desc: textValueEl.value,
      amount: +amountValueEl.value,
      type: validateType(amountValueEl.value)
    }
    balanceList.push(obj)
    window.localStorage.setItem('balanceList', JSON.stringify(balanceList))
    updateDOM()
    textValueEl.value = ''
    amountValueEl.value = ''
  } else {
    validationEl.classList.add('show-validation')
    setTimeout(() => validationEl.classList.remove('show-validation'), 1500)
  }
})

function getLocalStorage () {
  const locStorage = window.localStorage.getItem('balanceList')
  const temp = JSON.parse(locStorage) || []
  balanceList = [...temp] || []
  updateDOM()
}

getLocalStorage()