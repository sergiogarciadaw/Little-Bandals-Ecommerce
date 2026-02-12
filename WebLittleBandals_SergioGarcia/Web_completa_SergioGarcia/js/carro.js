// Cargar carrito al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    
    // Event listener para botón finalizar
    const btnFinalizar = document.getElementById('finalizarBtn');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
});

// Cargar carrito desde la base de datos
async function cargarCarrito() {
    try {
        const response = await fetch('../php/obtener_carrito.php');
        const data = await response.json();

        document.getElementById('loadingCarrito').style.display = 'none';

        if (data.success && data.items.length > 0) {
            document.getElementById('carroContainer').style.display = 'grid';
            renderizarProductos(data.items);
            actualizarResumen(data.subtotal, data.envio, data.total);
        } else {
            mostrarCarritoVacio();
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        mostrarError();
    }
}

// Renderizar productos en el DOM
function renderizarProductos(items) {
    const productosLista = document.getElementById('productosLista');
    productosLista.innerHTML = '';

    items.forEach(function(item) {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto-item';
        productoDiv.setAttribute('data-carrito-id', item.carrito_id);
        productoDiv.setAttribute('data-precio', item.precio);
        
        productoDiv.innerHTML = `
            <button class="eliminar-btn" data-carrito-id="${item.carrito_id}">&times;</button>
            <div class="producto-imagen">
                <img src="../imagenes/${item.imagen_frontal.split('/').pop()}" alt="${item.nombre}">
            </div>
            <div class="producto-info">
                <h3>${item.nombre}</h3>
            </div>
            <div class="producto-precio">
                <span class="precio-unitario">&euro;${parseFloat(item.precio).toFixed(2)}</span>
            </div>
            <div class="producto-cantidad">
                <button class="cantidad-btn menos-btn" data-carrito-id="${item.carrito_id}" data-cantidad="${item.cantidad}">-</button>
                <input type="number" value="${item.cantidad}" min="1" class="cantidad-input" readonly>
                <button class="cantidad-btn mas-btn" data-carrito-id="${item.carrito_id}" data-cantidad="${item.cantidad}">+</button>
            </div>
            <div class="producto-total">
                <span class="total-producto">&euro;${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
        `;
        
        productosLista.appendChild(productoDiv);
    });
    
    // Agregar event listeners a los botones
    agregarEventListeners();
}

// Agregar event listeners
function agregarEventListeners() {
    // Botones eliminar
    document.querySelectorAll('.eliminar-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const carritoId = parseInt(this.getAttribute('data-carrito-id'));
            eliminarProducto(carritoId);
        });
    });
    
    // Botones menos
    document.querySelectorAll('.menos-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const carritoId = parseInt(this.getAttribute('data-carrito-id'));
            const cantidadActual = parseInt(this.getAttribute('data-cantidad'));
            cambiarCantidad(carritoId, cantidadActual - 1);
        });
    });
    
    // Botones más
    document.querySelectorAll('.mas-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const carritoId = parseInt(this.getAttribute('data-carrito-id'));
            const cantidadActual = parseInt(this.getAttribute('data-cantidad'));
            cambiarCantidad(carritoId, cantidadActual + 1);
        });
    });
}

// Actualizar resumen
function actualizarResumen(subtotal, envio, total) {
    document.getElementById('subtotal').textContent = '\u20AC' + subtotal;
    document.getElementById('envio').textContent = '\u20AC' + envio;
    document.getElementById('total').textContent = '\u20AC' + total;
}

// Cambiar cantidad de un producto
async function cambiarCantidad(carritoId, nuevaCantidad) {
    if (nuevaCantidad < 1) return;

    try {
        const response = await fetch('../php/actualizar_carrito.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                carrito_id: carritoId,
                cantidad: nuevaCantidad
            })
        });

        const data = await response.json();

        if (data.success) {
            const producto = document.querySelector('[data-carrito-id="' + carritoId + '"]');
            const precioUnitario = parseFloat(producto.getAttribute('data-precio'));
            
            producto.querySelector('.cantidad-input').value = nuevaCantidad;
            producto.querySelector('.total-producto').textContent = '\u20AC' + (precioUnitario * nuevaCantidad).toFixed(2);
            
            // Actualizar atributos data-cantidad
            producto.querySelectorAll('.menos-btn, .mas-btn').forEach(function(btn) {
                btn.setAttribute('data-cantidad', nuevaCantidad);
            });
            
            recalcularTotales();
        } else {
            alert('Error al actualizar la cantidad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar la cantidad');
    }
}

// Eliminar producto del carrito
async function eliminarProducto(carritoId) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const response = await fetch('../php/actualizar_carrito.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                carrito_id: carritoId
            })
        });

        const data = await response.json();

        if (data.success) {
            const producto = document.querySelector('[data-carrito-id="' + carritoId + '"]');
            
            producto.style.opacity = '0';
            producto.style.transform = 'translateX(-20px)';
            
            setTimeout(function() {
                producto.remove();
                recalcularTotales();
                
                const productosRestantes = document.querySelectorAll('.producto-item');
                if (productosRestantes.length === 0) {
                    mostrarCarritoVacio();
                }
            }, 300);
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    }
}

// Recalcular totales
function recalcularTotales() {
    const productos = document.querySelectorAll('.producto-item');
    let subtotal = 0;
    
    productos.forEach(function(producto) {
        const precioUnitario = parseFloat(producto.getAttribute('data-precio'));
        const cantidad = parseInt(producto.querySelector('.cantidad-input').value);
        subtotal += precioUnitario * cantidad;
    });
    
    const envio = 5.00;
    const total = subtotal + envio;
    
    actualizarResumen(subtotal.toFixed(2), envio.toFixed(2), total.toFixed(2));
}

// Mostrar mensaje de carrito vacío
function mostrarCarritoVacio() {
    document.getElementById('carroContainer').style.display = 'none';
    const loadingDiv = document.getElementById('loadingCarrito');
    loadingDiv.style.display = 'block';
    loadingDiv.className = 'carrito-vacio-container';
    loadingDiv.innerHTML = `
        <h2 class="carrito-vacio-titulo">Tu carrito está vacío</h2>
        <p class="carrito-vacio-texto">¡Añade algunos Bandals increíbles!</p>
        <a href="shop.html" class="carrito-vacio-btn">IR A LA TIENDA</a>
    `;
}

// Mostrar error
function mostrarError() {
    const loadingDiv = document.getElementById('loadingCarrito');
    loadingDiv.className = 'error-container';
    loadingDiv.innerHTML = `
        <p class="error-text">Error al cargar el carrito</p>
        <a href="shop.html" class="error-link">Volver a la tienda</a>
    `;
}

// Finalizar compra
function finalizarCompra() {
    const productos = document.querySelectorAll('.producto-item');
    
    if (productos.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }
    
    const total = document.getElementById('total').textContent;
    alert('¡Gracias por tu compra!\n\nTotal: ' + total + '\n\nSerás redirigido al proceso de pago.');
}