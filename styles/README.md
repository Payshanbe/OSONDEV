# styles/

This directory is reserved for additional, opt-in stylesheets that should
**not** ship in every page bundle.

The global stylesheet lives at `app/globals.css` because Next.js App Router
requires global CSS to be imported from a server component in the `app/` tree.

Use this folder for:

- Design-system specific token files (when the system grows beyond the
  CSS variables in `app/globals.css`).
- Print stylesheets, email stylesheets, or stylesheets for embedded surfaces.
- Vendored / third-party CSS that's imported on a per-route basis.

Import them locally from the route, layout, or component that needs them.
