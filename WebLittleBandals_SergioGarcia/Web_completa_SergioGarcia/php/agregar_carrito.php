<?php
session_start();

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'little_bandals';
$username = 'root';
$password = 'mysql';

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verificar que el usuario esté logueado
    if (!isset($_SESSION['usuario_id'])) {
        echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión para agregar productos al carrito']);
        exit();
    }
    
    $usuario_id = $_SESSION['usuario_id'];
    
    // Obtener datos del POST
    $data = json_decode(file_get_contents('php://input'), true);
    $producto_id = isset($data['producto_id']) ? intval($data['producto_id']) : 0;
    
    if ($producto_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Producto inválido']);
        exit();
    }
    
    // Verificar si el producto existe
    $stmt = $pdo->prepare("SELECT id, nombre, precio FROM productos WHERE id = ?");
    $stmt->execute([$producto_id]);
    $producto = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$producto) {
        echo json_encode(['success' => false, 'message' => 'Producto no encontrado']);
        exit();
    }
    
    // Verificar si el producto ya está en el carrito
    $stmt = $pdo->prepare("SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?");
    $stmt->execute([$usuario_id, $producto_id]);
    $item_carrito = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($item_carrito) {
        // Si ya existe, incrementar cantidad
        $nueva_cantidad = $item_carrito['cantidad'] + 1;
        $stmt = $pdo->prepare("UPDATE carrito SET cantidad = ? WHERE id = ?");
        $stmt->execute([$nueva_cantidad, $item_carrito['id']]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Cantidad actualizada en el carrito',
            'cantidad' => $nueva_cantidad
        ]);
    } else {
        // Si no existe, agregar nuevo item
        $stmt = $pdo->prepare("INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, 1)");
        $stmt->execute([$usuario_id, $producto_id]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Producto agregado al carrito',
            'cantidad' => 1
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>