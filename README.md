# Portfolio 98 — GitHub Pages build

Static site. No backend, no build step. React and Babel load from a CDN at runtime;
all other files (JSX modules, CSS, images) are local and referenced with relative paths,
so the site works whether it is served from:

- a project page:  `https://USERNAME.github.io/REPOSITORY-NAME/`
- a user page:     `https://USERNAME.github.io/`
- a custom domain: `https://your-domain.com/`

## Deploy

1. Create a repository and push the **contents of this folder** to the branch you will serve
   (commonly `main` or a dedicated `gh-pages` branch). `index.html` must sit at the branch root.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick the branch and the `/ (root)` folder, then Save.
3. Wait for the green check, then open `https://USERNAME.github.io/REPOSITORY-NAME/`.

The empty `.nojekyll` file disables Jekyll so every file (including the `.jsx` modules) is
served verbatim.

## Custom domain

Add a `CNAME` file at the root containing just your domain (e.g. `portfolio.example.com`),
or set it under Settings → Pages → Custom domain. No path changes are needed — every
reference in the site is relative.

## Run locally

Do not open `index.html` with a `file://` URL — browsers block loading the `.jsx`
modules that way. Serve over HTTP instead:

```bash
cd gh-pages
python3 -m http.server 8000
# then open http://localhost:8000/
```
