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
    console.log('data', data);
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
  const {id, img, eventName, eventDescription, eventType, venue, startDate, endDate} = eventData;
  const eventDiv = document.createElement('div');
  eventDiv.classList.add('card');
  const contentMarkup = `
      <header class="vertical-layout-item">
        <h2 class="event-title text-2xl font-bold">${eventName}</h2>
      </header>
      <div class="vertical-layout-item vertical-layout">
        <img src="./src/assets/event1.jpg" alt="${eventName}" class="vertical-layout-item img rounded object-cover mb-4"/>
        <p class="vertical-layout-item text p text-gray-700">${eventDescription}</p>
        <p class="vertical-layout-item text p text-gray-700">${eventType}</p>
        <p class="vertical-layout-item text p text-gray-700">${venue}</p>
        <div class = "horizontal-layout">
        <p class="horizontal-layout-item text p text-gray-700">${startDate}</p>
        <p class="horizontal-layout-item text p text-gray-700">${endDate}</p>
        </div>
      </div>
      
    `;
    eventDiv.innerHTML = contentMarkup;
    // const ticketData = eventData.ticketCategories;
    return eventDiv;



}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data
  const eventData = [{
    id: 1,
    description: 'Sample event description.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    name: 'Sample Event',
    ticketCategories: [
      { id: 1, description: 'General Admission' },
      { id: 2, description: 'VIP' },
    ],
  },
  {
    id: 2,
    description: 'Another event description.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    name: 'Another Event',
    ticketCategories: [
      { id: 1, description: 'Standard Ticket' },
      { id: 2, description: 'Premium Ticket' },
    ],
  },
 ];
  const eventsContainer = document.querySelector('.events');
  eventData.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('card'); 
    
    // Create the event content markup
    const contentMarkup = `
      <header class="horizontal-layout-item">
        <h2 class="event-title text-2xl font-bold">${event.name}</h2>
      </header>
      <div class="horizontal-layout-item vertical-layout">
        <img src="${event.img}" alt="${event.name}" class="vertical-layout-item img rounded object-cover mb-4"/>
        <p class="vertical-layout-item text p text-gray-700">${event.description}</p>
        <label class="vertical-layout-item tickets ">Select ticket category:
      </label>
      </div>
      
    `;
    eventCard.innerHTML = contentMarkup;
    const ticketData = event.ticketCategories;
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

    const ticketContainer = eventCard.querySelector('.tickets');
    ticketContainer.appendChild(ticketCard);
    const quantitySelector = document.createElement('input');
    quantitySelector.type = 'number';
    quantitySelector.min = 0;
    quantitySelector.value = 0;
    quantitySelector.classList.add('quantity-selector');

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
      const selectedTicket = ticketCard.value;
      const selectedQuantity = parseInt(quantitySelector.value);
      if (selectedQuantity > 0) {
        console.log(`Added ${selectedQuantity} ${selectedTicket} for ${event.name} tickets to cart.`);
      }
    });
    eventCard.appendChild(quantitySelector);
    eventCard.appendChild(addToCartButton);
    eventsContainer.appendChild(eventCard);


  })
  // Create the event card element

  
}
function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

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
