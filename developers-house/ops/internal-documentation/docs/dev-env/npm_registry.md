---
title: NPM registry
---

Certain projects needs Developer's House internal NPM packages.
To download them, you have to configure your NPM client.

First you have to generate a personal access token from your
[GitLab settings](https://gitlab.com/-/profile/personal_access_tokens)
with thr permission `api`.

```shell
# You say to NPM to use GitLab for Developer's House organisation : "developers-house".
npm config set @developers-house:registry https://gitlab.com/api/v4/packages/npm/
# GitLab token authorization configuration for NPM
npm config set -- '//gitlab.com/api/v4/packages/npm/:_authToken' "<your_token>"
# GitLab token authorization configuration for Yarn
npm config set -- '//gitlab.com/api/v4/projects/:_authToken' "<your_token>"
```

> Don't forget to replace `<your_token>` by the personal access token you generated.

Now, you can download the NPM packages of the organization.