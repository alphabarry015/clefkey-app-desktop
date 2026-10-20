# Clefkey. — App desktop

Client **desktop** (Tauri 2 / Rust) du gestionnaire de mots de passe [Clefkey](https://github.com/alphabarry015/Clefkey).

Le **site web et l’API Django** restent dans le dépôt principal. Ce dépôt contient l’UI client et le shell natif.

## État actuel

| Élément | Statut |
|---------|--------|
| `frontend/` | Aligné site (passphrase, MDP min. 8, soft-lock) |
| Shell Tauri (`src-tauri/`) | Initialisé (Tauri 2, bundle NSIS) |
| API prod | `https://clefkey.vercel.app` |
| API dev (`:1420`) | `http://localhost:8000` |
| Installateur Windows | CI → [Releases](https://github.com/alphabarry015/clefkey-app-desktop/releases/latest) (tag `v0.1.0`) |
| Bouton site | Navbar → page `/download.html` (Windows + macOS) |
| Bundles CI | Windows `Clefkey-Setup.exe` + macOS `Clefkey-macOS.dmg` |

**Reste à faire** : voir [docs/RESTE.md](./docs/RESTE.md).

## Prérequis (dev local)

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) stable — sur Windows : toolchain **MSVC** (`rustup default stable-x86_64-pc-windows-msvc`) + Build Tools C++

## Démarrage UI (sans Tauri)

```bash
npm install
npm run frontend:serve
# → http://localhost:1420  (API locale :8000)
```

## Publier un installateur (CI)

```bash
git tag v0.1.1   # ou version suivante
git push origin v0.1.1
```

Le workflow `.github/workflows/release.yml` construit l’installeur NSIS et publie aussi l’alias stable **`Clefkey-Setup.exe`**.

Téléchargement direct (bouton site, sans page Releases) :

```text
https://github.com/alphabarry015/clefkey-app-desktop/releases/latest/download/Clefkey-Setup.exe
```

Le dépôt doit être **public** pour que le téléchargement anonyme fonctionne.

### URL de l’API

| Contexte | Base API |
|----------|----------|
| Build / app installée | `https://clefkey.vercel.app` |
| `npm run frontend:serve` (:1420) | `http://localhost:8000` |
| Override (hôte allowlist uniquement) | `localStorage.setItem('clefkey_api_base', '…')` puis reload |

CORS : le site Django autorise les origines Tauri en prod ; en `DEBUG`, aussi `:1420`.

## Contenu

```
frontend/                 # UI (WebView)
src-tauri/                # Shell Rust / Tauri 2
.github/workflows/        # Release Windows
docs/RESTE.md             # Backlog ouvert
scripts/assemble-frontend.mjs
```

## Licence

MIT — voir [LICENSE](./LICENSE).
