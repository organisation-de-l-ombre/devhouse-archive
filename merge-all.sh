#!/bin/env bash

REPOS=(developers-house/internal/entry-tests
developers-house/login/gdpr-collector
developers-house/ops/meta
developers-house/agent
developers-house/ops/tf
developers-house/ops/autoyast
developers-house/international-media-referencing/discord-bot
developers-house/international-media-referencing/imr-frontend-design
developers-house/international-media-referencing/ressources
developers-house/euphemia
developers-house/ops/internal-documentation
developers-house/login/rhea
developers-house/international-media-referencing/amelia
developers-house/login/candace
developers-house/international-media-referencing/imr-frontend
developers-house/ops/gitlab-ci-collection
developers-house/ops/deploy-chart
developers-house/login/alma
developers-house/login/datamanager
developers-house/login/cryir
developers-house/website/abdera
developers-house/login/sienna
developers-house/login/ellie
developers-house/login/scarlet
developers-house/website/website)

for repo in "${REPOS[@]}";
do
    echo "merging $repo"
    git subtree add -P "$repo" "../$repo" HEAD
done
