
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/pxfuel.jpg" alt="summer">
      <div class="flex flex-col items-center">
        <div class="w-80">
          <h1>Explore events</h1>
          <div class="filters flex flex-col">
            <input type="text" id="filter-name" placefolder="Filter by name" class="px-4 mt-4 mb-4 py-2 border" />
            <button id="filter-button" class ="filter-btn px-4 py-2 text-white rounded-lg bg-red-500">Filter</button>
          </div>
        </div>
      </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="orders place-items-center p-2 grid gap-2 grid-cols-7" id="order-container">
        <div>  
        <button class="flex flex-1 text-center justify-center" id="sorting-button-1">
          <span>Name</span>
          <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-1"></i>
          </button>
          </div>
          <div class="flex-1 text-center justify-center">Nr.tickets</div>
          <div class="flex-1 text-center justify-center">Category</div>
          <div class="flex-1 hidden md:flex text-center justify-center">Date</div>
          <div>
          <button class="hidden md:flex text-center justify-center" id="sorting-button-2">
          <span text-center justify-center>Price</span>
          <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-2"></i>
          </button>
          </div>
          <div class="col-span-1 w-16"></div>
          <div class="col-span-1 w-16"></div>
        </div>
      </div>

  `;
}

function liveSearch(){
  const filterInput = document.querySelector('#filter-name');
  if(filterInput){
    const searchValue = filterInput.value;

    if(searchValue !== undefined){
      const filteredEvents = events.filter((event) => 
      event.eventName.toLowerCase().includes(searchValue.toLowerCase()));
      addEvents(filteredEvents);
    }
  }
}

function setupFilterEvents(){
  const nameFilterInput= document.querySelector('#filter-name');
  nameFilterInput.addEventListener('keyup', () =>{
    setTimeout(() => {
      liveSearch();
    }, 500);
    
  })

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
    createCheckboxesForEvents(data);
    addEvents(data);
  });
  setupFilterEvents();

}
function setupHtmlForEventType(filtersContainer){
  const eventTypeFilterDiv = document.createElement('div');
  eventTypeFilterDiv.classList.add('filter-container');
  const eventTypeTitlte = document.createElement('h3');
  eventTypeTitlte.textContent = 'Filter By Event Type';
  eventTypeFilterDiv.appendChild(eventTypeTitlte);
  filtersContainer.appendChild(eventTypeFilterDiv);
  return eventTypeFilterDiv;

}

async function handleCheckBoxFilter(){
  const filters = getFilters();
  if(!filters.length){
    const events = await fetchTicketEvents();  
    addEvents(events);
  }
  console.log('filters', filters);
  try{
    const filteredData = await getTicketEvents(filters);
    addEvents(filteredData);

  }catch (error){
    console.error('Error fetching filtered events', error);
  }

}
function getTicketEvents(filters){
  const queryParams = new URLSearchParams(filters).toString();
  const query = 'https://localhost:7203/api/Event/GetEventsByEventType?'+queryParams;
  const result = fetch(query,{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',

    },

  }
  ).then((res) => res.json()).then((data) => {
    return [...data];
  });
  return result;
 
}

function getFilters(){
  const eventTypeFilters = Array.from(document.querySelectorAll('[id^="filter-by-event-type"]'))
    .filter((checkBox) => checkBox.checked).map((checkBox) => checkBox.value);
    return {
      eventType: eventTypeFilters,
    };
  }


function createCheckbox(type, value){
  const checkBoxContainer = document.createElement('div');
  const checkBox = document.createElement('input');

  checkBox.type = 'checkbox';
  checkBox.id = 'filter-by-'+type+'-'+value;
  checkBox.value = value;
  checkBox.addEventListener('change', () => handleCheckBoxFilter());
  const label = document.createElement('label');
  label.setAttribute('for', 'filter-by-${type}-${value}');
  label.textContent = value;
  checkBoxContainer.appendChild(checkBox);
  checkBoxContainer.appendChild(label);

  return checkBoxContainer;

}

function createCheckboxesForEvents(events){
  const eventTypeSet = new Set(events.map((event) => event.eventType));
  const filterContainer = document.querySelector('.filters');
  const addFiltersContainer = document.createElement('div');

  const eventTypeFilterDiv = setupHtmlForEventType(filterContainer);
  eventTypeSet.forEach((eventType) => {
    const checkBoxContainer = createCheckbox('event-type', eventType);
    eventTypeFilterDiv.appendChild(checkBoxContainer);

  });


}

let events = [];
async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7203/api/Event/GetAll');
  const data = await response.json();
  events = data;
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
  const {eventId, img, eventName, eventDescription, eventType, venue, startDate, endDate, ticketCategory, imageUrl} = eventData;
  const eventDiv = document.createElement('div');
  const imga = imageUrl;
  eventDiv.classList.add('card');
  eventDiv.classList.add(eventId);
  const contentMarkup = `
      <header class="vertical-layout-item">
        <h2 class="event-title text-2xl font-bold">${eventName}</h2>
      </header>
      <div class=" delimiter-line vertical-layout-item"></div>
      <div class="vertical-layout-item vertical-layout">
        <img src="${imageUrl}" alt="${eventName}" class="vertical-layout-item img rounded object-cover mb-4"/>
        <p class="vertical-layout-item text p ">${eventDescription}</p>
        <p class="vertical-layout-item text p ">${eventType}</p>
        <p class="vertical-layout-item text p ">${venue}</p>
        <div class = "horizontal-layout">
        <p class="horizontal-layout-item text p text-gray-700">${startDate}</p>
        <p class="horizontal-layout-item text p text-gray-700">${endDate}</p>
        </div>
        <label class="tickets" style="color: rgb(243, 64, 64);"> Choose ticket type:
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
    titleOption.textContent = 'Choose ticket type';
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
  const orderContent = document.getElementById('order-container');
  // orderContent.innerHTML = 'No orders';
  if (orders.length){
    // orderContent.innerHTML ='';
    orders.forEach(order => {
      // orderContent.appendChild(createOrder(order));
      createOrder(order);
    })
    orderDiv.appendChild(orderContent);
    
  }
})

const createOrder = ((orderData) => {
  const title = orderData.name;
  const orderElement = createOrderElement(orderData);
  console.log(orderElement);
  return orderElement;

})

const createOrderElement = ((orderData) => {
  const {orderId, customerName, orderedAt, numberOfTickets, totalPrice, ticketCategoryName} = orderData;
  const orderDiv = document.createElement('div');
  const orderCard = 'order-'+orderId;
  const orderContainer = document.getElementById('order-container');
  const customer = document.createElement('div');
  customer.textContent = customerName;
  orderContainer.append(customer);
  const ticketsNo = document.createElement('div');
  ticketsNo.textContent = numberOfTickets;
  orderContainer.append(numberOfTickets);
  const ticketName = document.createElement('div');
  ticketName.textContent = ticketCategoryName;
  const date = document.createElement('div');
  date.textContent = orderedAt;
  const price = document.createElement('div');
  price.textContent = totalPrice;
  orderContainer.append(ticketName);
  orderContainer.append(date);
  orderContainer.append(price);
  const editButton = document.createElement('div');
  editButton.classList.add('col-span-1');
  editButton.classList.add('w-16');
  editButton.innerHTML = `<button class="text-center justify-center" id="edit-button">
  <i class="fa-solid fa-pencil" id="edit-button"></i>
</button>`
orderContainer.append(editButton);
const deleteButton = document.createElement('div');
deleteButton.classList.add('col-span-1');
deleteButton.classList.add('w-16');
deleteButton.innerHTML = `<button class=" text-center justify-center" id="delete-button">
<i class="fa-solid fa-trash-can" id="delete-button"></i>
</button>`
orderContainer.append(deleteButton);


  const contentMarkup = `
  <div class="text-center custom-width custom-height">${customerName}</div>
  <div class="text-center custom-width custom-height">${numberOfTickets}</div>
  <div class="text-center custom-width custom-height">${ticketCategoryName}</div>
  <div class="text-center custom-width custom-height">${orderedAt}</div>
  <div class="text-center custom-width custom-height">${totalPrice}</div>
  <div>
  <button class="text-center justify-center" id="edit-button">
    <i class="fa-solid fa-pencil" id="edit-button"></i>
  </button>
  </div>
  <div>
   <button class=" text-center justify-center" id="delete-button">
    <i class="fa-solid fa-trash-can" id="delete-button"></i>
  </button>
  </div>
`;

  // orderContainer.append(contentMarkup);
  
});


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
