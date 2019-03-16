
# figmex

Generate development-ready theme JSON / SCSSS/ LESS files from Figma Styles

- Parse [Styles][] from a Figma file ID
- Works with [Styled System][] and other CSS-in-JS setups
- Works with [scss, less, etc][] and other CSS-in-JS setups
- Built with [figma-api][]

```sh
npm i figmex
```

## Getting Started

1. Install `figmex` as a dev dependency in your project
2. Get a [personal access token][token] for the Figma API
3. Create a `.env` file with your access token
  - `FIGMA_TOKEN=<personal-access-token>`
  - Alternatively add an environment variable for `FIGMA_TOKEN`
4. Add an npm run script: `figmex <figma-file-id>` (see params for output)
5. Run the script to create a `theme.json` and styles file based on Figma Styles

## Options

Options can be passed as CLI flags or included in a `figma-theme` object in your `package.json`

- `--out-dir`, `-d`: output directory (default current working directory), default './'
- `--format`, `-f`: include additional metadata from the Figma API, default './less'
- `--metadata`: include additional metadata from the Figma API

[Styles]: https://help.figma.com/properties-panel/styles
[Styled System]: https://jxnblk.com/styled-system
[token]: https://www.figma.com/developers/docs#auth-dev-token
[figma-js]: https://github.com/jongold/figma-js
[style-dictionary]: https://github.com/amzn/style-dictionary
Based on idea
[figma-theme]: https://github.com/jxnblk/figma-theme

<!--
- TRi6YSk76405ImoatoMF1u28
- 2aMG4hw2qp3jSTGmtAMyhZ
- JGLoPfwRFqCwn4xZ8wUmSwp7
- Yw9L6FATzLpdcsnA5vdSgCRT
-->

