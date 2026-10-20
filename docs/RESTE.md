# Ce qui reste — Clefkey desktop

Suivi des tâches **ouvertes**. Ce qui est déjà livré est listé en bas.

## Priorité 1 — Distribution

| Tâche | Détail |
|-------|--------|
| Vérifier la release CI | Confirmer l’asset stable `Clefkey-Setup.exe` sur [Releases](https://github.com/alphabarry015/clefkey-app-desktop/releases/latest) (téléchargement direct du bouton site) |
| Repo public | Le dépôt desktop doit être **public** pour le download anonyme |
| Redeploy site (Vercel) | Déployer le repo [Clefkey](https://github.com/alphabarry015/Clefkey) pour activer le bouton **Télécharger** + CORS Tauri en prod |
| Tester l’installeur | Installer l’`.exe` sur une machine Windows propre, login contre `https://clefkey.vercel.app` |

## Priorité 2 — Shell natif (Tauri)

| Tâche | Détail |
|-------|--------|
| Icônes produit | Remplacer les placeholders Tauri (`src-tauri/icons/`) par le logo Clefkey / chevalier |
| Tray système | Icône barre des tâches, ouvrir / verrouiller / quitter |
| Auto-lock natif | Compléter le soft-lock web (focus perdu, veille OS, fermeture fenêtre) |
| Presse-papiers volatile | Copie mot de passe avec effacement automatique après N secondes |
| Keyring OS | Optionnel : stocker le JWT / matériel non secret dans le coffre Windows (Credential Manager) — **jamais** le mot de passe maître ni la vault key |

## Priorité 3 — Qualité & ops

| Tâche | Détail |
|-------|--------|
| Build local | Quand assez d’espace disque + VS Build Tools MSVC : `npm run build` hors CI |
| Sync frontend | Après chaque grosse MAJ du site : recopier `frontend/` (sauf `js/config.js`) + `npm run frontend:assemble` |
| Signature code | Certificat Authenticode pour l’installeur (évite SmartScreen) |
| Linux | Bundle AppImage/deb + job CI (Windows + macOS déjà en release) |
| Mise à jour auto | Plugin Tauri updater + endpoint releases |

## Déjà fait

- Scaffold Tauri 2 + `frontend/` assemblé (partials Django → HTML statique)
- Sync passphrase, MDP min. 8, comportements de verrouillage (aligné site)
- API prod `https://clefkey.vercel.app` / dev `http://localhost:8000` (allowlist stricte)
- Durcissement CSP Tauri, CORS site (origines Tauri, preflight 403 hors liste)
- Bouton **Télécharger** dans la navbar du site → releases GitHub
- Workflow `.github/workflows/release.yml` + tag `v0.1.0`
