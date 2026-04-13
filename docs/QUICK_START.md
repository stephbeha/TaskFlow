# 🚀 Démarrage Rapide de TaskFlow

## 📌 Commandes Essentielles

### ▶️ LANCER LE PROJET COMPLET

#### Option 1: PowerShell (Recommandé)
```powershell
cd c:\Users\ASUS\Downloads\TaskFlow-main
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser  # Si demandé
.\start-dev.ps1
```

#### Option 2: Batch (Windows)
```cmd
cd c:\Users\ASUS\Downloads\TaskFlow-main
start-dev.bat
```

#### Option 3: Manuel (Tous OS)
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

---

## 🌐 URLs

```
Frontend:  http://localhost:5173
Backend:   http://localhost:5000
Local Net: http://192.168.1.105:5173
```

---

## 🔧 Réinstallation des Dépendances

Si vous avez besoin de réinstaller:

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install --legacy-peer-deps
```

---

## 📊 Arrêt du Projet

```powershell
# Fermer les terminaux ou:
Ctrl+C dans chaque terminal

# Tuer les processus (si coincés)
Get-Process | Where-Object {$_.Name -match "python|node"} | Stop-Process -Force
```

---

## 🧹 Nettoyage

```bash
# Supprimer les packages installés (réinstallation complète)
cd frontend
rm -r node_modules package-lock.json

cd ../backend
rm -r __pycache__ .venv

# Réinstaller après
cd ../backend
pip install -r requirements.txt

cd ../frontend
npm install --legacy-peer-deps
```

---

## ⚡ Commandes Utiles

```bash
# Vérifier les versions
python --version
npm --version
node --version

# Lancer uniquement le backend
cd backend && python app.py

# Lancer uniquement le frontend  
cd frontend && npm run dev

# Construire pour production (frontend)
cd frontend && npm run build

# Vérifier les packages
npm list
pip freeze
```

---

## 🎯 Utilisation Basique

1. **Ouvrez** http://localhost:5173
2. **Créez** une tâche → "Add new task..."
3. **Sélectionnez** la colonne destination
4. **Cliquez** "Add"
5. **Demander à l'IA** → Cliquez la tâche → "AI Suggest"
6. **Drag & Drop** entre colonnes pour changer le statut
7. **Supprimez** avec la poubelle

---

## 📁 Structure Fichiers Importants

```
TaskFlow/
├── backend/
│   ├── app.py              ← Serveur Flask + IA
│   ├── tasks_data.json     ← Données (auto-sauvegardées)
│   └── requirements.txt    ← Dépendances Python
│
├── frontend/
│   ├── src/App.jsx         ← Interface principale
│   ├── vite.config.js      ← Config dev server
│   └── package.json        ← Dépendances npm
│
└── SETUP_COMPLETE.md       ← Documentation complète
```

---

## 🆘 Aide Rapide

**Port déjà utilisé?**
```powershell
Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess
taskkill /PID [PID] /F
```

**Modèle AI ne charge pas?**
- Vérifiez votre connexion internet
- Première démarrage = téléchargement 269MB
- Attendez patiemment (~2-5 minutes)

**npm command not found?**
```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
npm --version
```

---

## 📊 Fichier de Données

Les tâches sont sauvegardées dans: `backend/tasks_data.json`

Format:
```json
[
  {
    "id": 1,
    "title": "Task Title",
    "description": "Description",
    "status": "backlog|in_progress|completed",
    "priority": "normal|critical",
    "points": 1-8
  }
]
```

---

## ✨ C'est Prêt!

Enjoy TaskFlow! 🚀

Pour plus de détails, voir: `SETUP_COMPLETE.md`
