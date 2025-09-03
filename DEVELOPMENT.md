# Guide de Développement - n8n-nodes-nimbasms

## 🚀 Configuration de l'environnement de développement

### Prérequis
- Docker et Docker Compose installés
- Node.js et npm

### Démarrage rapide

1. **Clone et installation :**
   ```bash
   git clone <votre-repo>
   cd n8n-nodes-nimbasms
   npm install
   ```

2. **Premier build :**
   ```bash
   npm run build
   ```

3. **Démarrage de l'environnement de développement :**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. **Accès à n8n :**
   Ouvrez http://localhost:5678 dans votre navigateur

### 🔄 Rechargement automatique

Après chaque modification du code :

```bash
npm run dev:reload
```

Ou directement :
```bash
./dev-reload.sh
```

### 🧹 Résolution des problèmes de cache

Si vous voyez l'erreur "Could not find property option" :

1. **Vider le cache du navigateur :**
   - F12 → Clic droit sur rafraîchir → "Vider le cache et actualiser"
   - Ou Ctrl+Shift+R (Windows/Linux) / Cmd+Shift+R (Mac)

2. **Redémarrer complètement n8n :**
   ```bash
   docker compose -f docker-compose.dev.yml down
   docker compose -f docker-compose.dev.yml up -d
   ```

3. **Vérifier que le build est à jour :**
   ```bash
   npm run build
   ```

### 📝 Tests

- Tests unitaires : `npm test`
- Tests avec surveillance : `npm run test:watch`
- Couverture : `npm run test:coverage`

### 📦 Publication

```bash
npm run prepublishOnly  # Build + tests
npm publish
```

## 🐛 Résolution de problèmes courants

### "Could not find property option"
- Cache du navigateur
- Version de n8n non rechargée
- Erreur dans la structure des propriétés du nœud

### "Cannot find module"
- Dépendances manquantes : `npm install`
- Build pas à jour : `npm run build`

### Performance lente
- Vérifier les logs : `docker logs n8n-dev -f`
- Redémarrer : `npm run dev:reload` 