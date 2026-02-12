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
        echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
        exit();
    }
    
    $usuario_id = $_SESSION['usuario_id'];
    
    // Obtener datos del POST
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : '';
    $carrito_id = isset($data['carrito_id']) ? intval($data['carrito_id']) : 0;
    $cantidad = isset($data['cantidad']) ? intval($data['cantidad']) : 0;
    
    if ($action === 'delete') {
        // Eliminar item del carrito
        $stmt = $pdo->prepare("DELETE FROM carrito WHERE id = ? AND usuario_id = ?");
        $stmt->execute([$carrito_id, $usuario_id]);
        
        echo json_encode(['success' => true, 'message' => 'Producto eliminado del carrito']);
        
    } elseif ($action === 'update' && $cantidad > 0) {
        // Actualizar cantidad
        $stmt = $pdo->prepare("UPDATE carrito SET cantidad = ? WHERE id = ? AND usuario_id = ?");
        $stmt->execute([$cantidad, $carrito_id, $usuario_id]);
        
        echo json_encode(['success' => true, 'message' => 'Cantidad actualizada', 'cantidad' => $cantidad]);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Acción inválida']);
    }
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>