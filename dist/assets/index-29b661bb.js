(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function T(t){history.pushState(null,null,t),h(t)}function w(){return`
   <div id="content" >
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `}function M(){return`
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="orders flex items-center justify-center flex-wrap">
      <div class="bg-white px-4 py-3 gap-x-4 flex font_bold">
      <button class="flex flex-1 text-center justify-center" id="sorting-button-1">
      <span>Name</span>
      <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-1"></i>
      </button>
      <span class="flex-1">Nr.tickets</span>
      <span class="flex-1">Category</span>
      <span class="flex-1 hidden md:flex">Date</span>
      <button class="hidden md:flex text-center justify-center" id="sorting-button-2">
      <span>Price</span>
      <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-2"></i>
      </button>
      </div>
      <div id ="orders-context"></div>
      </div>
    </div>
  `}function P(){document.querySelectorAll("nav a").forEach(e=>{e.addEventListener("click",r=>{r.preventDefault();const i=e.getAttribute("href");T(i)})})}function $(){const t=document.getElementById("mobileMenuBtn"),e=document.getElementById("mobileMenu");t&&t.addEventListener("click",()=>{e.classList.toggle("hidden")})}function S(){window.addEventListener("popstate",()=>{const t=window.location.pathname;h(t)})}function I(){const t=window.location.pathname;h(t)}function N(){const t=document.querySelector(".main-content-component");t.innerHTML=w(),console.log("function",x()),x().then(e=>{q(e)})}async function x(){return await(await fetch("https://localhost:7203/api/Event/GetAll")).json()}const q=t=>{const e=document.querySelector(".events");e.innerHTML="No events",t.length&&(e.innerHTML="",t.forEach(r=>{e.appendChild(A(r))}))},A=t=>{t.name;const e=H(t);return console.log(e),e},H=t=>{const{id:e,img:r,eventName:i,eventDescription:n,eventType:o,venue:s,startDate:v,endDate:E,ticketCategory:F,imageUrl:C}=t,l=document.createElement("div");l.classList.add("card");const k=`
      <header class="vertical-layout-item">
        <h2 class="event-title text-2xl font-bold">${i}</h2>
      </header>
      <div class=" delimiter-line vertical-layout-item"></div>
      <div class="vertical-layout-item vertical-layout">
        <img src="${C}" alt="${i}" class="vertical-layout-item img rounded object-cover mb-4"/>
        <p class="vertical-layout-item text p ">${n}</p>
        <p class="vertical-layout-item text p ">${o}</p>
        <p class="vertical-layout-item text p ">${s}</p>
        <div class = "horizontal-layout">
        <p class="horizontal-layout-item text p text-gray-700">${v}</p>
        <p class="horizontal-layout-item text p text-gray-700">${E}</p>
        </div>
        <label class="tickets" style="color: rgb(243, 64, 64);"> Choose ticket type:
      </label>
      </div>
      
    `;l.innerHTML=k;const L=t.ticketCategory,u=document.createElement("select");u.classList.add("ticket-select");const m=document.createElement("option");m.disabled=!0,m.selected=!0,m.textContent="Choose ticket type",u.appendChild(m),L.forEach(a=>{const p=document.createElement("option");p.value=a.description,p.textContent=a.description,u.appendChild(p)}),l.querySelector(".tickets").appendChild(u);const c=document.createElement("input");c.type="number",c.min=0,c.value=0,c.classList.add("quantity-selector");const d=document.createElement("button");return d.textContent="Add to Cart",d.classList.add("add-to-cart-button"),d.style.display="none",c.addEventListener("input",()=>{const a=parseInt(c.value);d.style.display=a>0?"block":"none"}),d.addEventListener("click",()=>{const a=u.value,p=t.ticketCategory.findIndex(y=>y.description==a),g=t.ticketCategory[p],f=parseInt(c.value),O=g.price*f;if(f>0){const y=new Date().toISOString();j(f,O,g.ticketCategoryId,y),console.log(`Added ${f} ${a} for ${t.eventName} tickets to cart.`)}}),l.appendChild(c),l.appendChild(d),l},j=(t,e,r,i)=>{const n=t;parseInt(n)&&fetch("https://localhost:7203/api/Order/addOrder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketCategoryId:+r,customerName:"Alexe Alexandru",orderedAt:i,numberOfTickets:+n,totalPrice:+e})}).then(o=>o.json().then(s=>(o.ok||console.log("Something went wrong!"),s))).then(o=>{addOrder(o)})};function z(t){const e=document.querySelector(".main-content-component");e.innerHTML=M(),console.log("function",b()),b().then(r=>{D(r)})}async function b(){return await(await fetch("https://localhost:7203/api/Order/getAllOrdersByCustomerId?id=4")).json()}const D=t=>{const e=document.querySelector(".orders-context");e.innerHTML="No orders",t.length&&(e.innerHTML="",t.forEach(r=>{e.appendChild(B(r))}))},B=t=>{t.name;const e=U(t);return console.log(e),e},U=t=>{const{orderId:e,customerName:r,orderedAt:i,numberOfTickets:n,totalPrice:o}=t,s=document.createElement("div");s.classList.add("card");const v=`
      <header class="vertical-layout-item">
        <h2 class="order-title text-2xl font-bold">${e}</h2>
      </header>
      <div class="vertical-layout-item order-vertical-layout">
        <p class="vertical-layout-item text order-p ">${r}</p>
        <p class="vertical-layout-item text order-p ">${i}</p>
        <div class = "order-horizontal-layout">
        <p class="horizontal-layout-item order-text p">No of tickets:</p>
        <p class="horizontal-layout-item text p order-text-gray-700">${n}</p>
        </div>
        <div class = "horizontal-layout">
        <p class="horizontal-layout-item order-text p">Price: </p>
        <p class="horizontal-layout-item text p order-text-gray-700">${o}</p>
        </div>
        
      </div>
      
    `;return s.innerHTML=v,s};function h(t){const e=document.querySelector(".main-content-component");e.innerHTML="",t==="/"?N():t==="/orders"&&z()}P();$();S();I();
