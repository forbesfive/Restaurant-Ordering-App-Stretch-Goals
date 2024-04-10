import menuArray from './data.js'

const orderContainerEl = document.getElementById('order-container')
const modalFormEl = document.getElementById('modal-form')

const payerNameEl = document.getElementById('payer-name')
const cardNumberEl = document.getElementById('card-number')
const cardCvvEl = document.getElementById('card-cvv')

const discountPercent = 10

let discountAvailable = false
let orderList = []
let discountAmount = 0

if(discountPercent > 0){
    discountAvailable = true
}

function populateMenu() {

    if(discountAvailable){
        document.getElementById('discount-text').style.display = 'block'
        document.getElementById('discount-text').textContent = `Meal Deal - ${discountPercent}% off a Pizza and a Beer - One per order `
    }

    menuArray.forEach(function(item){
        const {name, ingredients, id, price, image} = item
        
        document.getElementById('item-list').innerHTML += `
            <li class="item">
                <img src="${image}">
                <div class="item-text">
                    <h3>${name}</h3>
                    <p>${[...ingredients].join(', ')}</p>
                    <h4>$${price}</h4>
                </div>
                <button type="button" class="add-btn" data-add-btn="${id}">+</button>
            </li>
        `   
    })
}


populateMenu()

function handleEventListeners() {
    document.addEventListener('click', function(e){
        if(e.target.dataset.addBtn){
            handleAddOrderedItem(e.target.dataset.addBtn)
        }
        else if(e.target.dataset.orderItem){
            handleDeleteOrderedItem(e.target.dataset.orderItem)
        }
        else if(e.target.id === 'purchase-btn'){
            handleCompleteOrder()
        }
        else if(e.target.id === 'pay-btn'){
                payerNameEl.style.border = '1px solid #757575'
                cardNumberEl.style.border = '1px solid #757575'
                cardCvvEl.style.border = '1px solid #757575'
            if(modalFormEl.checkValidity()){
                e.preventDefault()
                handlePayment()
            } else {
                if(!payerNameEl.checkValidity()){
                    payerNameEl.style.border = '1px solid red'
                }
                
                if(!cardNumberEl.checkValidity()){
                    cardNumberEl.style.border = '1px solid red'
                }
                
                if(!cardCvvEl.checkValidity()){
                    cardCvvEl.style.border = '1px solid red'
                }   
            }
            
        }
        else if(!e.target.closest('.modal')) {
            modalFormEl.style.display = 'none'
        }
    })
}

handleEventListeners()

function handleAddOrderedItem(itemId) {
    
    orderContainerEl.style.display = 'block'
    
    menuArray.map((item) => {
        if(itemId == item.id){
            orderList.push(item)
        }
    })
    
    if(discountAvailable) {
        handleDiscount()
    }

    renderOrderList(orderList)
}

function handleDeleteOrderedItem(itemId){
    let remIndex
    
    orderList.map((item, index) => {
        if(itemId == item.id){
            remIndex = index
        }
    })

    orderList.splice(remIndex, 1)
    
    if(orderList.length === 0){
        orderContainerEl.style.display = 'none'
    }
    
    if(discountAvailable) {
        handleDiscount()
    }

    renderOrderList(orderList)
}

function handleDiscount(){
    const mealDealAppliedTextEl = document.getElementById('meal-deal-applied-text')
    let discount = 0
    
    menuArray.forEach((item)=>{
        if(item.id === 0){
            discount += item.price
        }
        if(item.id === 2){
            discount += item.price
        }
    })  
    
    let discountArray = orderList.filter((item)=>{
        return item.id === 0 || item.id === 2
    })
    
    if(discountArray.length >= 2){
        discountArray.forEach((item1)=>{
            if(item1.id === 0){
                discountAmount = 0
                mealDealAppliedTextEl.style.display = 'none'
                discountArray.forEach((item2)=>{
                    if(item2.id === 2){
                        discountAmount = discount * discountPercent / 100
                        mealDealAppliedTextEl.style.display = 'block'
                        mealDealAppliedTextEl.textContent = `Discount (£${discountAmount.toFixed(2)})`
                    }
                })
            }
            if(item1.id === 2){
                discountAmount = 0
                mealDealAppliedTextEl.style.display = 'none'
                discountArray.forEach((item2)=>{
                    if(item2.id === 0){
                        discountAmount = discount * discountPercent / 100
                        mealDealAppliedTextEl.style.display = 'block'
                    }
                })
            }
        })
    }
    else {
        discountAmount = 0
        mealDealAppliedTextEl.style.display = 'none'
    }
}

function handleCompleteOrder(){
    
    modalFormEl.style.display = 'inline'
}

function handlePayment() {
    const confirmationTextContainerEl = document.getElementById('confirmation-text-container')
    const confirmationTextEl = document.getElementById('confirmation-text')
    
    modalFormEl.style.display = 'none'
    orderContainerEl.style.display = 'none'
    
    confirmationTextEl.innerHTML = `Thanks, ${payerNameEl.value}! Your order is on its way!`
    
    confirmationTextContainerEl.style.display = 'block'
    
    setTimeout(function(){
        confirmationTextContainerEl.style.display = 'none'
    }, 6000)
    
    orderList = []
    payerNameEl.value = ''
    cardNumberEl.value = ''
    cardCvvEl.value = ''
}
    
function renderOrderList(orderList) {
    const orderItemListEl = document.getElementById('order-item-list')
    const orderTotalEl = document.getElementById('order-total')
    let orderTotal = 0

    orderItemListEl.innerHTML = ``
    
    orderList.map((item) => {
        const {name, ingredients, id, price, image} = item
        
        orderItemListEl.innerHTML += `
            <li class="order-item">
                <div>
                    <h3 class="order-item-title">${name}</h3>
                    <button class="remove-btn" data-order-item="${id}">remove</button>
                </div>
                <h4 class="order-item-price">$${price}</h4>
            </li>
        `
        orderTotal += price
    })

    orderTotalEl.innerHTML = `$${orderTotal - discountAmount}`
}
