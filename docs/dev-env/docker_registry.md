---
title: Registre Docker
---

Les services coté serveur de Developer's House sont tous
contenus dans des conteneurs OCI (ou Docker) il est parfois utile de pouvoir télécharger ces images pour pouvoir regarder ce qu'il y a dedans. Les images docker sont stoquées dans le registre Docker de GitLab.

Comme les paquets NPM, vous allez devoir créer un token d'acces avec la permission "read_registry".

Puis taper dans votre invite de commande

```shell
docker login
```

avec comme nom d'utilisateur votre pseudo GitLab et comme mot de passe le token d'acces que vous avez crée.