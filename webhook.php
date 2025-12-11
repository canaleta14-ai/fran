<?php
/**
 * GitHub Webhook para Despliegue Automático
 * Coloca este archivo en: /var/www/vhosts/lovehibo.com/httpdocs/webhook.php
 */

// Configuración
$secret = 'cambiar_por_secret_seguro'; // Cambia esto por un token seguro
$deployScript = '/var/www/vhosts/lovehibo.com/deploy.sh';
$logFile = '/var/www/vhosts/lovehibo.com/webhook.log';

// Función para log
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Validar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    logMessage('ERROR: Method not allowed');
    die('Method not allowed');
}

// Obtener payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Validar firma de GitHub
if (!empty($secret)) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    
    if (!hash_equals($expectedSignature, $signature)) {
        http_response_code(403);
        logMessage('ERROR: Invalid signature');
        die(json_encode(['error' => 'Invalid signature']));
    }
}

// Decodificar payload
$data = json_decode($payload, true);

// Verificar que es un push a master
if (isset($data['ref']) && $data['ref'] === 'refs/heads/master') {
    logMessage('INFO: Push detected to master branch');
    
    // Ejecutar script de despliegue en segundo plano
    $command = "nohup $deployScript > /dev/null 2>&1 &";
    exec($command, $output, $returnCode);
    
    if ($returnCode === 0) {
        logMessage('SUCCESS: Deployment triggered');
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Deployment triggered',
            'timestamp' => date('c')
        ]);
    } else {
        logMessage('ERROR: Failed to trigger deployment');
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to trigger deployment'
        ]);
    }
} else {
    logMessage('INFO: Ignored - not a push to master');
    http_response_code(200);
    echo json_encode([
        'status' => 'ignored',
        'message' => 'Not a push to master branch'
    ]);
}
?>
