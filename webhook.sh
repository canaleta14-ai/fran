#!/bin/bash

# Webhook endpoint para despliegue automático desde GitHub
# Coloca este archivo en: /var/www/vhosts/lovehibo.com/webhook.sh

# Secret token para validar peticiones de GitHub (cámbialo por uno seguro)
SECRET="tu_secret_token_aqui"

# Leer el payload
read -d '' payload

# Verificar la firma (opcional pero recomendado)
# signature=$(echo -n "$payload" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# Ejecutar el script de despliegue
/bin/bash /var/www/vhosts/lovehibo.com/deploy.sh > /dev/null 2>&1 &

echo "Content-Type: application/json"
echo ""
echo '{"status":"success","message":"Deployment triggered"}'
