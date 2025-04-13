const addItemBtn = document.getElementById('addItemBtn');
const modalBackground = document.getElementById('modalBackground');
const addItemForm = document.getElementById('addItemForm');
const wishlistContainer = document.getElementById('wishlistItems');
const completedContainer = document.getElementById('completedItems');
const wishlistTab = document.getElementById('wishlistTab');
const completedTab = document.getElementById('completedTab');

addItemBtn.addEventListener('click', () => {
  modalBackground.classList.remove('hidden');
  modalBackground.classList.add('animate-fade-in');
});

modalBackground.addEventListener('click', (e) => {
  if (e.target === modalBackground) {
    modalBackground.classList.remove('animate-fade-in');
    modalBackground.classList.add('hidden');
  }
});

wishlistTab.addEventListener('click', (e) => {
  e.preventDefault();
  wishlistContainer.classList.remove('hidden');
  completedContainer.classList.add('hidden');
  wishlistTab.classList.add('text-primary');
  wishlistTab.classList.remove('text-gray-500');
  completedTab.classList.add('text-gray-500');
  completedTab.classList.remove('text-primary');
});

completedTab.addEventListener('click', (e) => {
  e.preventDefault();
  wishlistContainer.classList.add('hidden');
  completedContainer.classList.remove('hidden');
  completedTab.classList.add('text-primary');
  completedTab.classList.remove('text-gray-500');
  wishlistTab.classList.add('text-gray-500');
  wishlistTab.classList.remove('text-primary');
});

let wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
renderWishlist();

addItemForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const productName = document.getElementById('productName').value;
  const productLink = document.getElementById('productLink').value;
  const productPrice = parseFloat(document.getElementById('productPrice').value);
  const productImage = document.getElementById('productImage').value;
  const productCategory = document.getElementById('productCategory').value;
  const productTags = document.getElementById('productTags').value.split(',').map(tag => tag.trim());

  const newItem = {
    id: Date.now(),
    name: productName,
    link: productLink,
    price: productPrice,
    savedAmount: 0,
    image: productImage,
    category: productCategory,
    tags: productTags,
  };

  wishlist.push(newItem);
  saveWishlist();
  renderWishlist();

  modalBackground.classList.add('hidden');
  addItemForm.reset();
});

function saveWishlist() {
  localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
}

function renderWishlist() {
    wishlistContainer.innerHTML = '';
    completedContainer.innerHTML = '';
  
    wishlist.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-indigo-50 border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col animate-fade-in-up';
  
      // Calculate progress % for color logic
      const progressPercent = Math.min((item.savedAmount / item.price) * 100, 100);
  
      let progressColor = "bg-red-500";
      if (progressPercent > 75) {
        progressColor = "bg-green-500";
      } else if (progressPercent > 20) {
        progressColor = "bg-yellow-400";
      }
  
      card.innerHTML = `
        <div class="h-48 w-full overflow-hidden rounded-t-2xl bg-indigo-100 flex justify-center items-center">
          <img src="${item.image}" alt="${item.name}" class="object-cover h-full w-full" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=No+Image';">
        </div>
  
        <div class="p-5 flex flex-col flex-grow justify-between">
  
          <div>
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-lg font-bold text-slate-800">
                <a href="${item.link}" target="_blank" class="hover:underline">${item.name}</a>
              </h2>
              <span class="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">${item.category}</span>
            </div>
  
            <p class="text-primary text-xl font-bold mb-4">Saved ₹${item.savedAmount} / ₹${item.price}</p>
  
            <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div class="${progressColor} h-3 rounded-full transition-all duration-500" style="width: ${progressPercent}%;"></div>
            </div>
  
            <div class="flex flex-wrap gap-2 mb-4">
              ${item.tags.map(tag => `<span class="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">${tag}</span>`).join('')}
            </div>
  
            ${item.savedAmount < item.price ? `
            <div class="flex gap-2 mb-4">
              <input type="number" placeholder="₹ Amount" id="saveInput-${item.id}" class="flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <button onclick="saveCustomAmount(${item.id})" class="bg-accent hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Add
              </button>
            </div>` : `<div class="text-green-600 font-semibold mb-4">Completed!</div>`}
  
            <div class="flex justify-end">
              <button onclick="deleteItem(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2v0m6-2a2 2 0 012 2v0m-6 4h.01M12 11h.01M15 11h.01M9 11h.01M5 7h14" />
                </svg>
                Delete
              </button>
            </div>
  
          </div>
  
        </div>
      `;
  
      if (item.savedAmount >= item.price) {
        completedContainer.appendChild(card);
      } else {
        wishlistContainer.appendChild(card);
      }
    });
  }
  

function saveCustomAmount(id) {
  const input = document.getElementById(`saveInput-${id}`);
  const amount = parseFloat(input.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  wishlist = wishlist.map(item => {
    if (item.id === id) {
      item.savedAmount += amount;
      if (item.savedAmount > item.price) {
        item.savedAmount = item.price;
      }
    }
    return item;
  });

  saveWishlist();
  renderWishlist();
}

function deleteItem(id) {
  const confirmed = confirm("Are you sure you want to delete this item?");
  if (confirmed) {
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist();
    renderWishlist();
  }
}
