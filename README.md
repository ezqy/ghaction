# GHACTION 

## Overview
The function to use private actions of external organization is not provided as of June 2023 by official.  
We provide features to help with this problem.  
This can be accomplished by using Github App to clone only the workflow in the private repository.  

## Usage

1. First, you need to prepare the following. If you have not created a GithubApp, prepare one.
- Your personal access token of github
- Private key of Github App

2. Copy workflows/setup-github-app.yml to .github/workflows in your repository.

3. Call this workflow using workflow_dispatch by github actions in your repository. Then the following will be registered in Action Secrets in your repository. The latter two are useful for debugging. You can turn them off.
- APP_ID
- PRIVATE_KEY
- ACTIONS_STEP_DEBUG
- ACTIONS_RUNNER_DEBUG

4. Once the secret is registered, external actions and workflows can be called and used as follows.
```
name: <workflow-name>

on:
  pull_request:

permissions:
  contents: read
  id-token: write

jobs:
  call-workflow:
  - id: generate_token
    uses: ezqy/ghaction/generate-github-app-token@v1.0.0
    with:
      app_id: ${{ secrets.app_id }}
      private_key: ${{ secrets.private_key }}
  - uses: actions/checkout@v3
    with:
      repository: <org>/<repo-name>
      path: ./.github/
      ref: v1.0.0
      token: ${{ steps.generate_token.outputs.token }}
    uses: ./.github/workflows/<workflow-name>.yml
    secrets: inherit
```