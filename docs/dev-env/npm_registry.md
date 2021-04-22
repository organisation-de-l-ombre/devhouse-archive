---
sidebar_position: 1
title: Registre NPM
---

Certains projets ont besoin de paquets npm internes Developer's House.
Afin de pouvoir les télécharger, vous devez configurer votre client npm.

Premièrement, vous devez gérerer un token d'accès personnel depuis vos [réglages
gitlab](https://gitlab.com/-/profile/personal_access_tokens) avec la permission "api".

```shell
# On dit a NPM d'utiliser gitlab pour l'organisation "developers-house".
npm config set @developers-house:registry https://gitlab.com/api/v4/packages/npm/
# Configuration du token d'authorisation de GitLab pour NPM
npm config set -- '//gitlab.com/api/v4/packages/npm/:_authToken' "<your_token>"
# Configuration du token d'authorisation de GitLab pour Yarn
npm config set -- '//gitlab.com/api/v4/projects/:_authToken' "<your_token>"
```

> N'oubliez pas de remplacer `<your_token>` avec le token d'acces que vous avez généré.

Vous devriez à partir de maintenant pouvoir télécharger les paquets de l'organisation.