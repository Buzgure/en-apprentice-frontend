// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="orders flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}
function renderHomePageBackend(){
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  console.log('function', fetchTicketEvents());
  fetchTicketEvents().then((data) => {
    addEvents(data);
  });

}

async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7203/api/Event/GetAll');
  const data = await response.json();
  return data;


}
const addEvents = (events) => {
  const eventDiv = document.querySelector('.events');
  eventDiv.innerHTML = 'No events';
  if (events.length){
    eventDiv.innerHTML ='';
    events.forEach(event => {
      eventDiv.appendChild(createEvent(event));
    })
    
  }
}

const createEvent = (eventData) => {
  const title = eventData.name;
  const eventElement = createEventElement(eventData);
  console.log(eventElement);
  return eventElement;
}

const createEventElement = (eventData) => {
  const {id, img, eventName, eventDescription, eventType, venue, startDate, endDate, ticketCategory} = eventData;
  const eventDiv = document.createElement('div');
  eventDiv.classList.add('card');
  const contentMarkup = `
      <header class="vertical-layout-item">
        <h2 class="event-title text-2xl font-bold">${eventName}</h2>
      </header>
      <div class="vertical-layout-item vertical-layout">
        <img src="./src/assets/event1.jpg" alt="${eventName}" class="vertical-layout-item img rounded object-cover mb-4"/>
        <p class="vertical-layout-item text p ">${eventDescription}</p>
        <p class="vertical-layout-item text p ">${eventType}</p>
        <p class="vertical-layout-item text p ">${venue}</p>
        <div class = "horizontal-layout">
        <p class="horizontal-layout-item text p text-gray-700">${startDate}</p>
        <p class="horizontal-layout-item text p text-gray-700">${endDate}</p>
        </div>
        <label class="text-gray-700 tickets ">Select ticket category:
      </label>
      </div>
      
    `;
    eventDiv.innerHTML = contentMarkup;
    const ticketData = eventData.ticketCategory;
    const ticketCard = document.createElement('select');
    ticketCard.classList.add('ticket-select');
    
    // Add a title or label option
    const titleOption = document.createElement('option');
    titleOption.disabled = true;
    titleOption.selected = true;
    titleOption.textContent = 'Select Ticket Category';
    ticketCard.appendChild(titleOption);

    ticketData.forEach(ticket => {
      const option = document.createElement('option');
      option.value = ticket.description;
      option.textContent = ticket.description;
      ticketCard.appendChild(option);
    });

    const ticketContainer = eventDiv.querySelector('.tickets');
    ticketContainer.appendChild(ticketCard);
    //
    const quantitySelector = document.createElement('input');
    quantitySelector.type = 'number';
    quantitySelector.min = 0;
    quantitySelector.value = 0;
    quantitySelector.classList.add('quantity-selector');
    ///

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.classList.add('add-to-cart-button');
    addToCartButton.style.display = 'none';

    quantitySelector.addEventListener('input', () => {
      const quantity = parseInt(quantitySelector.value);
      addToCartButton.style.display = quantity > 0 ? 'block' : 'none';
    });

    // Event listener for adding to cart
    addToCartButton.addEventListener('click', () => {
      const a = ticketCard;
      const selectedTicket = ticketCard.value;
      const ticketIndex = eventData.ticketCategory.findIndex(ticketName => ticketName.description == selectedTicket);
      const selectedTicketObject = eventData.ticketCategory[ticketIndex];
      const selectedQuantity = parseInt(quantitySelector.value);
      const ticketPrice = selectedTicketObject.price * selectedQuantity;
      if (selectedQuantity > 0) {
        const date = new Date().toISOString();;
        handleAddToCart(selectedQuantity, ticketPrice, selectedTicketObject.ticketCategoryId, date);
        console.log(`Added ${selectedQuantity} ${selectedTicket} for ${eventData.eventName} tickets to cart.`);
      }
    });
    eventDiv.appendChild(quantitySelector);
    eventDiv.appendChild(addToCartButton);
    
    
    return eventDiv;



}

const handleAddToCart = (input, price, ticketId, date) => {
  const quantity = input;
  if (parseInt(quantity)){
      fetch('https://localhost:7203/api/Order/addOrder', {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          ticketCategoryId:+ticketId,
          customerName:"Alexe Alexandru",
          orderedAt:date,
          numberOfTickets:+quantity,
          totalPrice:+price,


        })
      }).then((response)=>{
        return response.json().then((data) => {
          if(!response.ok){
            console.log("Something went wrong!");
          }
         return data;
        })

      }).then((data) => {
        addOrder(data);
      }) ;

  }else{

  }

}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  console.log('function', fetchOrders());
  fetchOrders().then((data) => {
    addOrders(data);
  });

}

async function fetchOrders(){
  const response = await fetch('https://localhost:7203/api/Order/getAllOrdersByCustomerId?id=4');
  const data = await response.json();
  return data;


}

const addOrders = ((orders) => {
  const orderDiv = document.querySelector('.orders');
  orderDiv.innerHTML = 'No orders';
  if (orders.length){
    orderDiv.innerHTML ='';
    orders.forEach(order => {
      orderDiv.appendChild(createOrder(order));
    })
    
  }
})

const createOrder = ((orderData) => {
  const title = orderData.name;
  const orderElement = createOrderElement(orderData);
  console.log(orderElement);
  return orderElement;

})

const createOrderElement = ((orderData) => {
 const {orderId, customerName, orderedAt, numberOfTickets, totalPrice} = orderData;
 const orderDiv = document.createElement('div');
 orderDiv.classList.add('card');
  const contentMarkup = `
      <header class="vertical-layout-item">
        <h2 class="order-title text-2xl font-bold">${orderId}</h2>
      </header>
      <div class="vertical-layout-item order-vertical-layout">
        <p class="vertical-layout-item text order-p ">${customerName}</p>
        <p class="vertical-layout-item text order-p ">${orderedAt}</p>
        <div class = "order-horizontal-layout">
        <p class="horizontal-layout-item order-text p">No of tickets:</p>
        <p class="horizontal-layout-item text p order-text-gray-700">${numberOfTickets}</p>
        </div>
        <div class = "horizontal-layout">
        <p class="horizontal-layout-item order-text p">Price: </p>
        <p class="horizontal-layout-item text p order-text-gray-700">${totalPrice}</p>
        </div>
        
      </div>
      
    `;
    orderDiv.innerHTML = contentMarkup;
  return orderDiv;

})

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePageBackend();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
