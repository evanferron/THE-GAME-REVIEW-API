# Guide de Développement

## 1. Introduction

Ce document est destiné aux développeurs travaillant sur ce projet. Il explique la structure du projet, les conventions de développement et la manière d'ajouter de nouvelles fonctionnalités.

## 2. Structure du Projet

```
├── .env
├── .env.exemple
├── .gitignore
├── create_local_database.ts
├── DEV.README.md
├── index.ts
├── package-lock.json
├── package.json
├── README.md
├── src
│  ├── base                # Classes de base pour une architecture commune
│  │  ├── AController.ts   # Classe parent des controllers
│  │  ├── AError.ts        # Classe parent des erreurs
│  │  └── ARepository.ts   # Classe parent des repositories
│  ├── config              # Configuration du projet
│  │  └── config.ts
│  ├── database            # Connexion à la base de données et repositories
│  │  ├── database.ts
│  │  └── repositories
│  │    ├── review.ts
│  │    └── user.ts
│  ├── docs                # Documentation
│  ├── modules             # Modules indépendants
│  │  ├── auth             # Gestion de l'authentification
│  │  │  ├── controller.ts
│  │  │  └── routes.ts
│  │  ├── review          # Module Review
│  │  │  ├── controller.ts
│  │  │  └── routes.ts
│  │  └── user            # Module User
│  │    ├── controller.ts
│  │    └── routes.ts
│  ├── routes              # Gestion centralisée des routes
│  │  └── index.ts
│  └── shared              # Code réutilisable
│    ├── error
│    │  └── ApiError.ts    # Gestion des erreurs applicatives
│    ├── index.ts
│    ├── middleware       # Middleware d’authentification et d’erreurs
│    │  ├── auth.ts
│    │  └── error.ts
│    ├── models           # Interfaces et modèles globaux
│    │  └── IModels.ts
│    └── utils            # Utilitaires
│      └── jwt.ts         # Gestion des JWT
├── tree.tree
└── tsconfig.json
```

## 3. Fonctionnement de la Configuration (`Config.ts`)

Le fichier `Config.ts` centralise la gestion des repositories et la connexion à la base de données. Il est instancié une seule fois dans `index.ts` et injecté dans les controllers.

### Exemple d'utilisation dans un Controller :

```ts
export class UserController extends AController {
  constructor(config: Config) {
    super(config);
  }

  public getAllUsers(req: Request, res: Response) {
    const users = this.getUserRepository().GetAll();
    res.json(users);
  }
}
```

## 4. Ajouter une Nouvelle Fonctionnalité

### Étape 1 : Créer un nouveau module

Ajoutez un dossier dans `modules/` avec un `controller.ts` et un `routes.ts`.

```sh
mkdir src/modules/newModule
```

### Étape 2 : Créer un Controller

Dans `src/modules/newModule/controller.ts` :

```ts
import { Config } from "../../config/config";
import { AController } from "../../base/AController";
import { Request, Response } from "express";

export class NewModuleController extends AController {
  constructor(config: Config) {
    super(config);
  }

  public getData(req: Request, res: Response) {
    res.json({ message: "Hello from new module" });
  }
}
```

### Étape 3 : Ajouter les Routes

Dans `src/modules/newModule/routes.ts` :

```ts
import { Router } from "express";
import { Config } from "../../config/config";
import { NewModuleController } from "./controller";

export function createNewModuleRoutes(config: Config): Router {
  const router = Router();
  const controller = new NewModuleController(config);

  router.get("/", controller.getData);
  return router;
}
```

### Étape 4 : Ajouter le module dans `index.ts`

Dans `src/index.ts`, ajoutez :

```ts
import { createNewModuleRoutes } from "./src/modules/newModule/routes";
app.use("/newModule", createNewModuleRoutes(config));
```

## 5. Gestion des Erreurs

Les erreurs sont centralisées dans `shared/error/ApiError.ts`. Exemple :

```ts
export class NotFoundError extends AError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}
```

Les middlewares d’erreur sont dans `shared/middleware/error.ts` et doivent être placés **en dernier** dans `index.ts`.

## 6. Lancer le Projet

```sh
npm install
npm run dev
```
