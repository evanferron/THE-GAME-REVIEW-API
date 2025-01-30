# 📌 Guide de Développement

## 📂 Architecture du projet

Ce projet suit une organisation modulaire et claire pour assurer une bonne maintenabilité et évolutivité. Voici un aperçu des dossiers principaux et de leur rôle :

```
├── src
│  ├── base         # Classes abstraites servant de base aux contrôleurs, repositories et erreurs
│  ├── config       # Fichiers de configuration globale
│  ├── database     # Gestion de la base de données et repositories
│  ├── docs         # Documentation du projet
│  ├── modules      # Contient les fonctionnalités principales de l'API (auth, user, review...)
│  ├── shared       # Ressources réutilisables dans tout le projet (middlewares, erreurs, utils...)
└── tsconfig.json   # Configuration TypeScript
```

### 📌 Détail des dossiers

- **`base/`** : Contient les classes abstraites utilisées pour factoriser du code commun.

  - `AController.ts` : Classe parent des contrôleurs.
  - `AError.ts` : Classe de base pour gérer les erreurs personnalisées.
  - `ARepository.ts` : Classe générique pour la gestion des repositories.

- **`config/`** : Contient la configuration globale, notamment la connexion à la base de données.

- **`database/`** : Gestion de la base de données.

  - `database.ts` : Configuration et connexion à la base de données.
  - `repositories/` : Contient les classes de gestion des modèles (User, Review...).

- **`docs/`** : Contient la documentation de l'API.

- **`modules/`** : Chaque sous-dossier représente une fonctionnalité indépendante de l'API.

  - `auth/` : Gestion de l'authentification.
  - `user/` : Gestion des utilisateurs.
  - `review/` : Gestion des avis.
  - Chaque module contient généralement un `controller.ts` et un `routes.ts`.

- **`shared/`** : Contient des ressources partagées dans l'application.
  - `error/` : Gestion des erreurs personnalisées (`ApiError.ts`).
  - `middleware/` : Middleware pour Express (`auth.ts`, `error.ts`).
  - `models/` : Interfaces et types globaux (`IModels.ts`).
  - `utils/` : Fonctions utilitaires réutilisables (`jwt.ts`).

---

## 🚀 Ajouter une nouvelle fonctionnalité

Pour ajouter une nouvelle fonctionnalité (par exemple "produits"), voici les étapes à suivre :

### 1️⃣ **Créer un dossier dans `modules/`**

```sh
mkdir src/modules/product
cd src/modules/product
```

### 2️⃣ **Créer les fichiers de base**

#### `controller.ts`

```ts
import { Request, Response } from "express";
import { AController } from "../../base/AController";
import { Config } from "../../config/config";

export class ProductController extends AController {
  constructor(config: Config) {
    super(config);
  }

  public getAllProducts(req: Request, res: Response) {
    res.json({ message: "Liste des produits" });
  }
}
```

#### `routes.ts`

```ts
import { Router } from "express";
import { ProductController } from "./controller";
import { Config } from "../../config/config";

const router = Router();
const productController = new ProductController(new Config());

router.get("/", (req, res) => productController.getAllProducts(req, res));

export default router;
```

### 3️⃣ **Enregistrer les routes dans `index.ts`**

Dans le fichier `index.ts` à la racine du projet, ajouter :

```ts
import productRoutes from "./src/modules/product/routes";

app.use("/api/products", productRoutes);
```

### 4️⃣ **Tester l'API**

Démarrer le serveur et tester la nouvelle route :

```sh
npm run dev
```

Puis accéder à :

```
GET http://localhost:3000/api/products
```

---

## 🎯 Bonnes pratiques

✅ Respecter l'organisation en modules.
✅ Utiliser `shared/` pour les fonctionnalités réutilisables.
✅ Toujours valider les entrées des utilisateurs.
✅ Ajouter des tests unitaires et d'intégration.

🚀 **Bonne dev et happy coding !**
