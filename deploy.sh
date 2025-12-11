#!/bin/bash

# Script de despliegue automático para lovehibo.com
# Este script hace pull de los últimos cambios desde GitHub

REPO_DIR="/var/www/vhosts/40966122.servicio-online.net/git/fran.git"
WEB_DIR="/var/www/vhosts/lovehibo.com/httpdocs"
LOG_FILE="/var/www/vhosts/lovehibo.com/deploy.log"

echo "===== Iniciando despliegue $(date) =====" >> $LOG_FILE

# Ir al directorio del repositorio
cd $REPO_DIR

# Guardar cambios locales si hay alguno
git stash >> $LOG_FILE 2>&1

# Obtener los últimos cambios
git pull origin master >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "Pull exitoso" >> $LOG_FILE
    
    # Copiar archivos al directorio web (excluyendo .git y backup)
    rsync -av --exclude='.git' --exclude='backup_2025-12-10' --exclude='deploy.sh' --exclude='.gitignore' $REPO_DIR/ $WEB_DIR/ >> $LOG_FILE 2>&1
    
    if [ $? -eq 0 ]; then
        echo "Archivos copiados exitosamente a $WEB_DIR" >> $LOG_FILE
        echo "✅ Despliegue completado con éxito $(date)" >> $LOG_FILE
    else
        echo "❌ Error al copiar archivos" >> $LOG_FILE
        exit 1
    fi
else
    echo "❌ Error en git pull" >> $LOG_FILE
    exit 1
fi

echo "===== Fin despliegue $(date) =====" >> $LOG_FILE
