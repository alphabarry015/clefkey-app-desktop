# Documentation — Clefkey desktop

Référence reprise du dépôt site (sans le déploiement web ni la spec extension).

| Fichier | Contenu |
|---------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack et flux |
| [API.md](./API.md) | Endpoints HTTP |
| [SECURITE.md](./SECURITE.md) | Modèle zero-knowledge |
| [CARTOGRAPHIE-COFFRE.md](./CARTOGRAPHIE-COFFRE.md) | Concepts et flux |
| [GUIDE-UTILISATEUR.md](./GUIDE-UTILISATEUR.md) | Utilisation |
| [AUDIT-MOT-DE-PASSE.md](./AUDIT-MOT-DE-PASSE.md) | Audit mots de passe |

L’API cible reste celle du site Clefkey en production (ou un serveur local Django pour le dev).

## Dev desktop (`localhost:1420`)

1. Django (repo site) sur `http://localhost:8000` avec `DEBUG=true` (CORS desktop activé).
2. Dans ce repo : `npm run frontend:serve` → `http://localhost:1420`
3. Un toast confirme `/health/` au chargement. Override : `localStorage.clefkey_api_base`.
