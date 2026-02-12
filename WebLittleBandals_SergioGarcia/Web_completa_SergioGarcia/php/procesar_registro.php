<?php
// Configuración de la base de datos
$host = 'localhost';
$dbname = 'little_bandals';
$username = 'root'; // Cambia esto según tu configuración
$password = 'mysql';     // Cambia esto según tu configuración

try {
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verificar que se envió el formulario por POST
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        // Obtener y sanitizar datos del formulario
        $nombre = trim($_POST['nombre']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        $fecha_nacimiento = $_POST['fecha_nacimiento'];
        
        // Validaciones básicas
        if (empty($nombre) || empty($email) || empty($password) || empty($fecha_nacimiento)) {
            die("Error: Todos los campos son obligatorios.");
        }
        
        // Validar formato de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            die("Error: Email inválido.");
        }
        
        // Validar edad (mayor de 13 años)
        $fecha_nac = new DateTime($fecha_nacimiento);
        $hoy = new DateTime();
        $edad = $hoy->diff($fecha_nac)->y;
        
        if ($edad < 13) {
            die("Error: Debes tener al menos 13 años para registrarte.");
        }
        
        // Verificar si el email ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            die("Error: Este email ya está registrado.");
        }
        
        // Encriptar contraseña
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insertar usuario en la base de datos
        $stmt = $pdo->prepare("
            INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, fecha_registro) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([$nombre, $email, $password_hash, $fecha_nacimiento]);
        
        // Obtener el ID del usuario recién creado
        $usuario_id = $pdo->lastInsertId();
        
        // Iniciar sesión automáticamente
        session_start();
        $_SESSION['usuario_id'] = $usuario_id;
        $_SESSION['nombre'] = $nombre;
        $_SESSION['email'] = $email;
        
        // Redirigir a la página principal con mensaje de bienvenida
        header("Location: ../html/index.html?bienvenido=" . urlencode($nombre));
        exit();
        
    } else {
        die("Error: Método de solicitud no válido.");
    }
    
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>