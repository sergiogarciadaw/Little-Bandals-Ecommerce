// Script para mostrar mensaje de bienvenida después del registro

window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreUsuario = urlParams.get('bienvenido');
    
    if (nombreUsuario) {
        mostrarMensajeBienvenida(nombreUsuario);
        
        // Limpiar URL sin recargar la página
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function mostrarMensajeBienvenida(nombre) {
    // Crear mensaje de bienvenida
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-bienvenida';
    mensaje.innerHTML = `
        <button class="close-btn" onclick="cerrarMensaje()">×</button>
        <div class="mensaje-titulo">¡Bienvenido a la banda, <strong>${nombre}</strong>!</div>
        <div class="mensaje-subtitulo">Tu registro fue exitoso</div>
    `;
    
    document.body.appendChild(mensaje);
    
    // Eliminar mensaje después de 5 segundos
    setTimeout(function() {
        mensaje.classList.add('fade-out');
        setTimeout(function() {
            mensaje.remove();
        }, 500);
    }, 5000);
}

function cerrarMensaje() {
    const mensaje = document.querySelector('.mensaje-bienvenida');
    if (mensaje) {
        mensaje.classList.add('fade-out');
        setTimeout(function() {
            mensaje.remove();
        }, 500);
    }
}