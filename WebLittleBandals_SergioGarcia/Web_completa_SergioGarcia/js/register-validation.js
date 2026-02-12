// Validación del formulario de registro

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('registroForm');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Las contraseñas no coinciden. Por favor, verifica.');
                return false;
            }
            
            // Validación de edad (mayor de 13 años)
            const fechaNacimiento = new Date(document.getElementById('fecha-nacimiento').value);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }
            
            if (edad < 13) {
                e.preventDefault();
                alert('Debes tener al menos 13 años para registrarte.');
                return false;
            }
            
            // El formulario se enviará normalmente al servidor
        });
    }
});