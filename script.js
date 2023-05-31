'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Akleem khan',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-05-30T23:36:17.929Z',
    '2023-05-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Sumeer Sharma',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// Input buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');


// Input Sections
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


//Add deposite and Withdrwal from in the movemet ////

const formatDate = function (newDate)
{ 
  const dayCalc = (date1, date2) => Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
  console.log(dayCalc);
  const dayPassesd = Math.round(dayCalc(new Date() , newDate))
  if (dayPassesd === 0) return 'Today';
  if (dayPassesd === 1) return 'Yesterday';
  if (dayPassesd <= 7) return `${dayPassesd} day ago`;

  else {
    const day = `${newDate.getDate()}`.padStart(2, '0');
   const month = `${newDate.getMonth() + 1}`.padStart(2, '0');
    const year = newDate.getFullYear();
  
     return `${day}/${month}/${year}`;
}}
const displayMovements = function (acc , sort = false) {
  containerMovements.innerHTML = ' ';

  acc.movements  =  sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDates = formatDate(date);
 
    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDates}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);


const calcDisplayBalance = function(acc)
{
  acc.balance = acc.movements.reduce((acc, cur) => cur + acc, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
}
// calcDisplayBalance(account1.movements);



// Display total deposit , withdrawal , interest ////
const calcDisplaySummary = function (acc)
{
  // Deposite
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  // withdrawal
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  // interest
  const interest = acc.movements.filter(mov =>mov > 0).map(dep => (dep * acc.interestRate) / 100).filter(int => int >=  1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
}
// calcDisplaySummary(account1.movements);



//Update UI
const updateUI = function (acc)
{
      displayMovements(acc);

   // Display Balancer
    calcDisplayBalance(acc);
     
    // Display Summary
    calcDisplaySummary(acc); 
}

const startLogOutTimer = function() 
{
   const take = function () {
     const min = String(Math.trunc(time / 60)).padStart(2 , 0);
    const sec = time % 60;
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }
      time--;
  }
  let time = 300;
  take();
  const timer = setInterval(take, 1000);
  return timer;
}

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1))
  {
       
    
    // Set Timer so that loan takre time 
    setTimeout(function () {
      // Add amount to movements
      currentAccount.movements.push(amount);

      // Note tuime and time
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = ''; 
});

//  Create user Name and modify the objects by adding user name //
const createUserName = function (accs)
{
  accs.forEach(function (acc) {
    acc.username =  acc.owner.toLowerCase().split(' ').map(word =>word[0]).join('');
  })
}
createUserName(accounts);
// console.log(accounts);

// Event Handlers 

let currentAccount  , timer;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting //
  e.preventDefault();
  currentAccount = accounts.find(acc=>acc.username===inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value))
  {
     // Display UI
    labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
   // make input login clear
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
   // Display MOvements
    containerApp.style.opacity = 100;
    
    
    if (timer) clearInterval(timer);

    timer = startLogOutTimer(); 
    
    updateUI(currentAccount);
    const now = new Date();
      const day = `${now.getDate()}`.padStart(2, '0');
      const month = `${now.getMonth() + 1}`.padStart(2, '0');
      const year = now.getFullYear();
      const hour = now.getHours();
     const min = now.getMinutes();
  }
});


//Transfer Money to other account///
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);
  
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username)
  {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount); 
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username &&  currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    
    // Delete Account
    accounts.splice(index, 1);

    // Change UI
    containerApp.style.opacity = 0;

    // Delete field
    inputCloseUsername.value = inputClosePin = '';
  }
});

// to Sort the movemenet windeo
let isSort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  isSort = !isSort;
  displayMovements(currentAccount, isSort);
});


// Number ---> + replace Number with + it change string to nUmber

     //                           SORT THE ARRAY
// // if return < 0 A, B retain the valuse
// // return > 0 B A switch order
// movements.sort((a, b) => a - b);
// console.log(movements )


