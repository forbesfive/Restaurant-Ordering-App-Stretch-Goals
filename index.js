import menuArray from './data.js'

const orderContainerEl = document.getElementById('order-container')
const modalFormEl = document.getElementById('modal-form')

const payerNameEl = document.getElementById('payer-name')
const cardNumberEl = document.getElementById('card-number')
const cardCvvEl = document.getElementById('card-cvv')

function populateMenu() {
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
    })
}

handleEventListeners()

let orderList = []

function handleAddOrderedItem(itemId) {
    
    orderContainerEl.style.display = 'block'
    
    menuArray.map((item) => {
        if(itemId == item.id){
            orderList.push(item)
        }
    })

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
    
    renderOrderList(orderList)
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
    
    orderTotalEl.innerHTML = `$${orderTotal}`
}
