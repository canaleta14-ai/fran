# Despliegue Automático - Guía de Instalación

## 📋 Archivos Creados

1. **deploy.sh** - Script principal de despliegue
2. **webhook.sh** - Endpoint para GitHub webhook

## 🚀 Instalación en Hostalia

### Paso 1: Preparar el repositorio en el servidor

Conéctate por SSH a Hostalia y ejecuta:

```bash
# Si el directorio ya existe, hacer pull
cd /var/www/vhosts/40966122.servicio-online.net/git/fran.git
git pull origin master

# Si no existe, clonar
git clone https://github.com/canaleta14-ai/fran.git /var/www/vhosts/40966122.servicio-online.net/git/fran.git
```

### Paso 2: Subir los scripts al servidor

```bash
# Subir deploy.sh
scp deploy.sh usuario@servidor:/var/www/vhosts/lovehibo.com/
ssh usuario@servidor "chmod +x /var/www/vhosts/lovehibo.com/deploy.sh"

# Subir webhook.sh (opcional para webhook automático)
scp webhook.sh usuario@servidor:/var/www/vhosts/lovehibo.com/
ssh usuario@servidor "chmod +x /var/www/vhosts/lovehibo.com/webhook.sh"
```

### Paso 3: Ejecutar el primer despliegue

```bash
ssh usuario@servidor
cd /var/www/vhosts/lovehibo.com/
./deploy.sh
```

Esto copiará todos los archivos desde el repositorio git a `httpdocs/`

### Paso 4: Configurar Webhook en GitHub (Opcional - Automático)

1. Ve a: https://github.com/canaleta14-ai/fran/settings/hooks
2. Click en "Add webhook"
3. Configuración:
   - **Payload URL**: `https://lovehibo.com/webhook.php` (crear archivo PHP)
   - **Content type**: application/json
   - **Secret**: (genera uno seguro)
   - **Events**: Just the push event
4. Click "Add webhook"

### Paso 5: Crear webhook.php para GitHub

Crea este archivo en el servidor: `/var/www/vhosts/lovehibo.com/httpdocs/webhook.php`

```php
<?php
// Validar secret
$secret = 'tu_secret_token_aqui'; // Cambia esto
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');

$expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expectedSignature, $signature)) {
    http_response_code(403);
    die('Invalid signature');
}

// Ejecutar despliegue
$output = shell_exec('/var/www/vhosts/lovehibo.com/deploy.sh 2>&1');
http_response_code(200);
echo json_encode(['status' => 'success', 'output' => $output]);
?>
```

## 📝 Uso Manual

Para desplegar manualmente después de hacer push a GitHub:

```bash
ssh usuario@servidor
/var/www/vhosts/lovehibo.com/deploy.sh
```

## 🔍 Ver logs de despliegue

```bash
ssh usuario@servidor
tail -f /var/www/vhosts/lovehibo.com/deploy.log
```

## ⚡ Despliegue Rápido (Sin Webhook)

Si no quieres configurar webhook, puedes hacer despliegue manual:

1. **Desde tu PC:** `git push`
2. **En el servidor:** `./deploy.sh`

O crear un alias en tu PC para hacer ambos:

```bash
# Añadir a ~/.bashrc o ~/.zshrc
alias deploy="git push && ssh usuario@servidor '/var/www/vhosts/lovehibo.com/deploy.sh'"
```

## 📂 Estructura de Archivos en el Servidor

```
/var/www/vhosts/lovehibo.com/
├── httpdocs/              # Archivos públicos (web)
│   ├── index.html
│   ├── css/
│   ├── logos/
│   └── webhook.php        # Endpoint webhook (opcional)
├── deploy.sh              # Script de despliegue
├── deploy.log             # Log de despliegues
└── git/
    └── fran.git/          # Repositorio clonado
```

## ✅ Verificación

Después del despliegue, verifica:

1. **Archivos actualizados:**
   ```bash
   ls -la /var/www/vhosts/lovehibo.com/httpdocs/
   ```

2. **Log de despliegue:**
   ```bash
   cat /var/www/vhosts/lovehibo.com/deploy.log
   ```

3. **Web funcionando:**
   - Abre: https://lovehibo.com
   - Verifica que las mejoras se vean

## 🔐 Seguridad

- Cambia el `SECRET` en webhook.sh por uno seguro
- No expongas deploy.sh públicamente
- Usa HTTPS para los webhooks
- Limita acceso SSH solo a tu IP si es posible

## 🆘 Troubleshooting

**Error: Permission denied**
```bash
chmod +x /var/www/vhosts/lovehibo.com/deploy.sh
chown usuario:usuario /var/www/vhosts/lovehibo.com/deploy.sh
```

**Error: git pull failed**
```bash
cd /var/www/vhosts/40966122.servicio-online.net/git/fran.git
git status
git reset --hard origin/master
```

**Error: rsync failed**
```bash
# Verifica permisos
ls -la /var/www/vhosts/lovehibo.com/httpdocs/
chmod -R 755 /var/www/vhosts/lovehibo.com/httpdocs/
```
