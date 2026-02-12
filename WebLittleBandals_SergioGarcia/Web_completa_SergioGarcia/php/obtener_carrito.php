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
        echo json_encode(['success' => false, 'message' => 'Usuario no autenticado', 'items' => []]);
        exit();
    }
    
    $usuario_id = $_SESSION['usuario_id'];
    
    // Obtener items del carrito con información de productos
    $stmt = $pdo->prepare("
        SELECT 
            c.id as carrito_id,
            c.cantidad,
            p.id as producto_id,
            p.nombre,
            p.precio,
            p.imagen_frontal,
            p.imagen_trasera
        FROM carrito c
        INNER JOIN productos p ON c.producto_id = p.id
        WHERE c.usuario_id = ?
        ORDER BY c.fecha_agregado DESC
    ");
    
    $stmt->execute([$usuario_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calcular totales
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += $item['precio'] * $item['cantidad'];
    }
    
    $envio = 5.00;
    $total = $subtotal + $envio;
    
    echo json_encode([
        'success' => true,
        'items' => $items,
        'subtotal' => number_format($subtotal, 2, '.', ''),
        'envio' => number_format($envio, 2, '.', ''),
        'total' => number_format($total, 2, '.', ''),
        'count' => count($items)
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage(), 'items' => []]);
}
?>