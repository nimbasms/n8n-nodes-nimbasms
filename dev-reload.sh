#!/bin/bash

echo "🔄 Rechargement du nœud n8n en développement..."

# Build du projet
echo "📦 Construction du projet..."
npm run build

# Redémarrage du conteneur Docker
echo "🐳 Redémarrage de n8n..."
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d

# Affichage des logs
echo "📋 Affichage des logs (Ctrl+C pour arrêter)..."
sleep 2
docker logs n8n-dev -f 