# Liste de suggestions concertnant le code d'imr

- Supprimer application/Account et mettre directement un dossier navigation, qui contient un composant pour la navigation "AccountNavigation" et mettre directement le navigateur dans le composant AccountRoot pour éviter de créer un composant "Wrapper" inutile dans l'arbre react.

- Utiliser un wrapper de hook pour useTranslation, qui nous évite de déstructurer l'objet translation et qui nous permet de récupérer différents namespace de translation comme ceci `const [tRoot, t] = useTranslation("root", "pages\\account\\account")`.

- Séparer les fonctions de management (removeUser) des fonctions de récupération, quand on utile seulement l'objet sans les fonctions de  management, de la mémoire inutile est utilisée afin de créer les fonctions (useCallback) entre autre et leur dépendances (dispatch).

- Créer un HOC qui permet de vérifier que l'utilisateur est connecté (withUser) pour éviter les conditions répétitives de vérification d'utilisateur.

- Si tu fais des fonctions de management dans des hooks, évite de recréer des useCallback pour dispatch les notifications.

- Corriger les types pour éviter absolument d'utiliser les "as" dans la codebase et qui ralentissent la compilation typescript.

- Créer des variables pour les endpoints