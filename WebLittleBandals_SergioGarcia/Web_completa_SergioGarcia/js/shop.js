const menuFiltros = document.getElementById('menuFiltros');
const menuFiltrosOffset = menuFiltros.offsetTop;

window.addEventListener('scroll', function() {
  if (window.pageYOffset > menuFiltrosOffset) {
    menuFiltros.classList.add('sticky');
  } else {
    menuFiltros.classList.remove('sticky');
  }
});

const botonesFiltr = document.querySelectorAll('.boton-filtro');
const productGrid = document.getElementById('productGrid');
const productCards = Array.from(document.querySelectorAll('.product-card'));

botonesFiltr.forEach(function(button) {
  button.addEventListener('click', function() {
    botonesFiltr.forEach(function(btn) {
      btn.classList.remove('active');
    });
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');
    sortProducts(filter);
  });
});

function sortProducts(filter) {
  let sortedCards = Array.from(productCards);

  if (filter === 'low-high') {
    sortedCards.sort(function(a, b) {
      return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
    });
  } else if (filter === 'high-low') {
    sortedCards.sort(function(a, b) {
      return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
    });
  } else if (filter === 'name-az') {
    sortedCards.sort(function(a, b) {
      return a.querySelector('h3').innerText.localeCompare(b.querySelector('h3').innerText);
    });
  } else if (filter === 'name-za') {
    sortedCards.sort(function(a, b) {
      return b.querySelector('h3').innerText.localeCompare(a.querySelector('h3').innerText);
    });
  } else if (filter === 'all') {
    sortedCards = productCards;
  }

  productGrid.innerHTML = '';
  sortedCards.forEach(function(card) {
    productGrid.appendChild(card);
  });
}

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase().trim();
  
  productCards.forEach(function(card) {
    const name = card.querySelector('h3').innerText.toLowerCase();
    
    if (name.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});

botonesFiltr.forEach(function(button) {
  if (button.getAttribute('data-filter') === 'all') {
    button.addEventListener('click', function() {
      searchInput.value = '';
      productCards.forEach(function(card) {
        card.style.display = '';
      });
    });
  }
});

document.querySelectorAll('.add-to-cart-btn').forEach(function(button) {
  button.addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
    agregarAlCarrito(productId, this);
  });
});

async function agregarAlCarrito(productId, button) {
  const textoOriginal = button.textContent;
  button.textContent = 'Agregando...';
  button.disabled = true;

  try {
    const response = await fetch('../php/agregar_carrito.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ producto_id: productId })
    });

    const data = await response.json();

    if (data.success) {
      button.textContent = '\u2713 Agregado';
      button.style.background = '#000000';
      button.style.color = '#bfff00';
      button.style.border = '2px solid #bfff00';
      
      setTimeout(function() {
        button.textContent = textoOriginal;
        button.style.background = '';
        button.style.color = '';
        button.style.border = '';
        button.disabled = false;
      }, 1000);
    } else {
      if (data.message.includes('iniciar sesión')) {
        alert('Debes registrarte para agregar productos');
        setTimeout(function() {
          window.location.href = 'register.html';
        }, 1500);
      } else {
        alert(data.message);
        button.textContent = textoOriginal;
        button.disabled = false;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al agregar el producto');
    button.textContent = textoOriginal;
    button.disabled = false;
  }
}