// Set this to the minimum legal age for the location where the site operates.
const LEGAL_AGE = 21;

const products = [
  {id:"cedar",name:"Cedar Grove",category:"flower",strain:"Hybrid",potency:18,thc:"18%",cbd:"<1%",price:38,weight:"3.5g",badge:"Grower’s pick",description:"A considered flower with soft citrus and fresh-cut herb notes.",image:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=85",effects:"Bright, balanced, and gently grounding. Individual experiences vary.",flavor:"Lemon peel · wild herbs · cedar",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."},
  {id:"wildflower",name:"Wildflower Minis",category:"pre-rolls",strain:"Sativa",potency:16,thc:"16%",cbd:"<1%",price:24,weight:"5 × 0.5g",badge:"Easygoing",description:"Small-batch pre-rolls, made for an unhurried afternoon.",image:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=85",effects:"A light, lively profile. Effects can differ from person to person.",flavor:"Sweet grass · citrus · light spice",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."},
  {id:"evening",name:"Evening Tincture",category:"oils",strain:"Hybrid",potency:10,thc:"5mg/ml",cbd:"10mg/ml",price:42,weight:"30ml",badge:"Balanced",description:"A measured, CBD-forward oil with a gentle botanical finish.",image:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85",effects:"A balanced cannabinoid profile. Not a medical product.",flavor:"Earthy botanicals · mild citrus",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."},
  {id:"cacao",name:"Cacao & Sea Salt",category:"edibles",strain:"Hybrid",potency:5,thc:"2.5mg / piece",cbd:"2.5mg / piece",price:18,weight:"10 pieces",badge:"Low dose",description:"Dark chocolate and a little sea salt, with clearly labeled pieces.",image:"https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=85",effects:"Ingestibles may take longer to take effect and last longer. Start low and wait.",flavor:"Dark cacao · flaky sea salt",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."},
  {id:"soil",name:"Good Soil Flower",category:"flower",strain:"Indica",potency:21,thc:"21%",cbd:"<1%",price:44,weight:"3.5g",badge:"Small batch",description:"Carefully grown flower with a rich, woodsy aroma and smooth finish.",image:"https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=800&q=85",effects:"A full-bodied profile. Labels cannot predict an individual response.",flavor:"Pine · dark fruit · warm earth",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."},
  {id:"daily",name:"Daily Ritual Balm",category:"accessories",strain:"—",potency:0,thc:"0%",cbd:"0%",price:16,weight:"Reusable tin",badge:"Plant-based",description:"A handy reusable tin for keeping little essentials together.",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",effects:"Accessory only; contains no cannabis.",flavor:"—",lab:"Not applicable"},
  {id:"meadow",name:"Meadow Drops",category:"oils",strain:"Hybrid",potency:5,thc:"<1mg/ml",cbd:"20mg/ml",price:36,weight:"30ml",badge:"CBD-forward",description:"A simple, measured tincture with a clean, grassy taste.",image:"https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=800&q=85",effects:"CBD does not produce a high. Effects and interactions vary.",flavor:"Green tea · clover · citrus",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."},
  {id:"sunrise",name:"Sunrise Sticks",category:"pre-rolls",strain:"Hybrid",potency:17,thc:"17%",cbd:"<1%",price:28,weight:"5 × 0.5g",badge:"Fan favorite",description:"A tidy five-pack from a partner grower who takes their time.",image:"https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=85",effects:"A varied profile from plant to plant. Consume only where legal.",flavor:"Orange zest · soft pepper · green tea",lab:"Illustrative placeholder only. No actual lab results; request a batch-specific COA from a licensed retailer."}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
let cart = readStore("cuzboss-cart", []);
let wishlist = readStore("cuzboss-wishlist", []);
let activeCategory = "all";
let searchTerm = "";
let toastTimer;

function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { showToast("Your browser couldn’t save this preference."); }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function displayPrice(amount) {
  return new Intl.NumberFormat("en-US", {style:"currency", currency:"USD"}).format(amount);
}

function renderProducts() {
  const grid = $("#shop-grid");
  let visible = products.filter(product =>
    (activeCategory === "all" || product.category === activeCategory) &&
    `${product.name} ${product.description} ${product.category} ${product.strain}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sort = $("#sort-select").value;
  if (sort === "price-low") visible.sort((a,b) => a.price-b.price);
  if (sort === "price-high") visible.sort((a,b) => b.price-a.price);
  if (sort === "strain") visible.sort((a,b) => a.strain.localeCompare(b.strain));
  if (sort === "potency") visible.sort((a,b) => b.potency-a.potency);
  if (!visible.length) {
    grid.innerHTML = '<p class="empty-products">Nothing found just yet. Try another search or category.</p>';
    return;
  }
  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image" data-product="${product.id}" tabindex="0" role="button" aria-label="View ${product.name} details">
        <img src="${product.image}" alt="${product.name} product photography" loading="lazy">
        <span class="product-badge">${product.badge}</span>
        <button class="wishlist-button ${wishlist.includes(product.id) ? "saved" : ""}" data-wishlist="${product.id}" aria-label="${wishlist.includes(product.id) ? "Remove from" : "Add to"} wishlist">${wishlist.includes(product.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-meta"><span>${product.strain}</span><span>THC ${product.thc} · CBD ${product.cbd}</span></div>
      <h3>${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-bottom"><span class="product-price">${displayPrice(product.price)}</span><button class="add-button" data-add="${product.id}">Add to bag +</button></div>
    </article>`).join("");
}

function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const total = cart.reduce((sum,item) => {
    const product = products.find(entry => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  $("#cart-count").textContent = count;
  $("#drawer-count").textContent = `(${count})`;
  $("#cart-subtotal").textContent = displayPrice(total);
  $("#checkout-total").textContent = displayPrice(total);
  const container = $("#cart-items");
  if (!cart.length) {
    container.innerHTML = '<p class="cart-empty">Your bag is taking a moment to find its footing.</p>';
    return;
  }
  container.innerHTML = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    if (!product) return "";
    return `<article class="cart-line">
      <img src="${product.image}" alt="">
      <div><h3>${product.name}</h3><p>${product.strain} · ${product.weight}</p>
        <div class="quantity-control"><button data-quantity="-1" data-id="${item.id}" aria-label="Remove one ${product.name}">−</button><span>${item.quantity}</span><button data-quantity="1" data-id="${item.id}" aria-label="Add one ${product.name}">+</button></div>
      </div><span class="cart-line-price">${displayPrice(product.price * item.quantity)}</span>
    </article>`;
  }).join("");
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  existing ? existing.quantity++ : cart.push({id,quantity:1});
  saveStore("cuzboss-cart", cart);
  renderCart();
  showToast(`${products.find(product => product.id === id).name} added to your bag.`);
}

function openCart() {
  $("#scrim").hidden = false;
  const drawer = $("#cart-drawer");
  drawer.inert = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden","false");
  document.body.classList.add("locked");
  $(".close-button", $("#cart-drawer")).focus();
}

function closeCart() {
  const drawer = $("#cart-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden","true");
  drawer.inert = true;
  $("#scrim").hidden = true;
  document.body.classList.remove("locked");
  $("#cart-open").focus();
}

function toggleWishlist(id) {
  wishlist = wishlist.includes(id) ? wishlist.filter(value => value !== id) : [...wishlist,id];
  saveStore("cuzboss-wishlist", wishlist);
  renderProducts();
  renderWishlist();
  showToast(wishlist.includes(id) ? "Saved to your wishlist." : "Removed from your wishlist.");
}

function renderWishlist() {
  const items = products.filter(product => wishlist.includes(product.id));
  $("#wishlist-items").innerHTML = items.length
    ? items.map(product => `<div class="wishlist-line"><span>${product.name} · ${displayPrice(product.price)}</span><button class="add-button" data-add="${product.id}">Add to bag</button></div>`).join("")
    : '<p class="dialog-intro">Your wishlist is ready when you are. Tap the heart on anything you’d like to remember.</p>';
}

function openProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  $("#product-detail").innerHTML = `<div class="detail-product">
    <img src="${product.image}" alt="${product.name} product photography">
    <div><span class="eyebrow">${product.strain} · ${product.weight}</span><h2 id="product-title">${product.name}</h2><p>${product.description}</p>
      <div class="detail-price">${displayPrice(product.price)}</div>
      <h3>Effects & experience</h3><p>${product.effects}</p>
      <h3>Flavor notes</h3><p>${product.flavor}</p>
      <h3>Lab results</h3><div class="lab-card">${product.lab}<br>THC: ${product.thc} &nbsp; CBD: ${product.cbd}</div>
      <h3>From the community</h3><p class="review-quote">“A lovely, considered pick. I appreciate the clear information.”</p>
      <button class="button button-dark" data-add="${product.id}">Add to bag · ${displayPrice(product.price)}</button>
    </div>
  </div>
  <div class="detail-related"><h3>Related, thoughtfully picked</h3><p>${products.filter(item => item.id !== product.id && (item.category === product.category || item.strain === product.strain)).slice(0,2).map(item => item.name).join(" · ") || "Explore the full collection."}</p></div>`;
  $("#product-dialog").showModal();
}

function closeDialog(dialog) {
  if (dialog.open) dialog.close();
}

document.addEventListener("DOMContentLoaded", () => {
  $("#legal-age").textContent = LEGAL_AGE;
  const gate = $("#age-gate");
  if (sessionStorage.getItem("cuzboss-age-confirmed") === "yes") gate.hidden = true;
  else {
    document.body.classList.add("locked");
    $("#age-yes").focus();
    gate.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = $$("button, a[href]", gate).filter(element => !element.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }
  $("#age-yes").addEventListener("click", () => {
    sessionStorage.setItem("cuzboss-age-confirmed","yes");
    gate.hidden = true;
    document.body.classList.remove("locked");
    $("#menu-toggle").focus();
  });
  $("#age-no").addEventListener("click", () => {
    $("#gate-title").textContent = "Thanks for stopping by.";
    $(".gate-card>p").textContent = `You must be at least ${LEGAL_AGE} to access this site. Please come back when you’re of legal age.`;
    $(".gate-actions").innerHTML = '<a class="button button-outline" href="https://www.google.com/">Leave this site</a>';
  });

  renderProducts();
  renderCart();
  renderWishlist();
  $$(".filter-tab").forEach(button => button.addEventListener("click", () => {
    $$(".filter-tab").forEach(tab => tab.classList.toggle("active", tab === button));
    activeCategory = button.dataset.category;
    renderProducts();
  }));
  $("#sort-select").addEventListener("change", renderProducts);
  $("#shop-grid").addEventListener("click", event => {
    const wish = event.target.closest("[data-wishlist]");
    const add = event.target.closest("[data-add]");
    const card = event.target.closest("[data-product]");
    if (wish) { event.stopPropagation(); toggleWishlist(wish.dataset.wishlist); return; }
    if (add) { event.stopPropagation(); addToCart(add.dataset.add); return; }
    if (card) openProduct(card.dataset.product);
  });
  $("#shop-grid").addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-product]")) {
      event.preventDefault();
      openProduct(event.target.dataset.product);
    }
  });
  $("#cart-items").addEventListener("click", event => {
    const button = event.target.closest("[data-quantity]");
    if (!button) return;
    const item = cart.find(entry => entry.id === button.dataset.id);
    if (!item) return;
    item.quantity += Number(button.dataset.quantity);
    if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== button.dataset.id);
    saveStore("cuzboss-cart",cart);
    renderCart();
  });
  $("#cart-open").addEventListener("click", openCart);
  $("#cart-drawer").addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCart();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = $$("button:not(:disabled), a[href], input:not(:disabled)", $("#cart-drawer"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  $("#scrim").addEventListener("click", closeCart);
  $$("[data-close]").forEach(button => button.addEventListener("click", closeCart));
  $("#checkout-open").addEventListener("click", () => {
    closeCart();
    $("#checkout-dialog").showModal();
  });
  $("#account-open").addEventListener("click", () => {
    renderWishlist();
    $("#account-dialog").showModal();
  });
  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add]");
    if (add && !$("#shop-grid").contains(add)) addToCart(add.dataset.add);
    const close = event.target.closest("[data-dialog-close]");
    if (close) closeDialog(close.closest("dialog"));
  });
  $("#search-toggle").addEventListener("click", () => {
    const panel = $("#search-panel");
    panel.hidden = !panel.hidden;
    if (!panel.hidden) $("#site-search").focus();
  });
  const runSearch = () => {
    searchTerm = $("#site-search").value.trim();
    activeCategory = "all";
    $$(".filter-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.category === "all"));
    renderProducts();
    $("#shop").scrollIntoView();
    $("#search-panel").hidden = true;
  };
  $("#search-submit").addEventListener("click",runSearch);
  $("#site-search").addEventListener("keydown",event => { if (event.key === "Enter") runSearch(); });
  $("#menu-toggle").addEventListener("click", () => {
    const nav = $("#main-nav");
    const open = nav.classList.toggle("open");
    $("#menu-toggle").setAttribute("aria-expanded",String(open));
    $("#menu-toggle").setAttribute("aria-label",open ? "Close menu" : "Open menu");
  });
  $$("#main-nav a").forEach(link => link.addEventListener("click", () => {
    $("#main-nav").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded","false");
  }));
  $("#checkout-form").addEventListener("submit",event => {
    event.preventDefault();
    $("#checkout-message").textContent = "Thanks — this was only a demo. No order has been placed.";
  });
  $("#contact-form").addEventListener("submit",event => {
    event.preventDefault();
    $("#contact-message").textContent = "Thanks for your note. This demo form isn’t connected to a mailbox.";
    event.currentTarget.reset();
  });
  $("#newsletter-form").addEventListener("submit",event => {
    event.preventDefault();
    $("#newsletter-message").textContent = "Thanks for your interest. Newsletter signup is demo-only.";
    event.currentTarget.reset();
  });
  const filterJournal = () => {
    const term = $("#journal-search").value.trim().toLowerCase();
    const category = $("#journal-category").value;
    $$(".journal-card").forEach(card => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesTerm = card.textContent.toLowerCase().includes(term);
      card.hidden = !matchesCategory || !matchesTerm;
    });
  };
  $("#journal-search").addEventListener("input", filterJournal);
  $("#journal-category").addEventListener("change", filterJournal);
});
