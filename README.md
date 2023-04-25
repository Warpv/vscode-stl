[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) ![workflow](https://github.com/Serhioromano/vscode-st/actions/workflows/publish.yml/badge.svg) [![Version](https://vsmarketplacebadge.apphb.com/version-short/serhioromano.vscode-st.svg)](https://marketplace.visualstudio.com/items?itemName=serhioromano.vscode-st) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/serhioromano.vscode-st.svg)](https://marketplace.visualstudio.com/items?itemName=serhioromano.vscode-st) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/serhioromano.vscode-st.svg)](https://marketplace.visualstudio.com/items?itemName=serhioromano.vscode-st)

# Structured Text (IEC 61131-3)

Most complete Structured Text language support. Features includes:

- Syntax highlights in \*.st, \*.iecst files
- Syntax highlights in \*.md (Markdown) files in `iecst` code block
- Syntax highlights in \*.xml files in `<Declaration>` and `<ST>` code block
- Snippets (enter `st ` to see list of all snippets)
- Outline view
- Breadcrumbs code navigation
- Go to Symbol in File
- Formatting (*beta)
- Commands

## Syntax Highlights

Includes syntax highlight based on IEC 61131-3 draft, including namespaces, SFC elements (STEP, ACTION, TRANSITION), constant variables (2#000_1010, 16#1E, INT#23) and more.

![Structured Text syntax highlights example](https://raw.githubusercontent.com/Serhioromano/vscode-st/master/images/demo.gif)

Also highlight in Markdown files

![Example]()

## Snippets

Fast growing snippets library. All cycles, conditions and declarations.

## Formatter (work in progress)

Utilize VS Code Formatter API. Use general formatting command short keys. It capitalize all known keywords like `TRUE`, `FALSE`, `IF`, `BOOL`, ... It also add spaces.

## Roadmap

- LSP (Language Server Protocol)
- Suggestions
- Lints

## Release Notes

### 1.0.0

- fix - extensions metadata tags
- add - new functions to support logi.CAD 3 reference variables.
- enhance - auto indentations inside IF, PROGRAM, VAR, ...
- fix - close `[` bracket
- add - region folding
- improve - keywords case
- improve - readme file
- improve - syntax highlights scopes
- add- few new snippets.
- fix - some keywords highlight issue
- add- new file extensions to support logi.CAD 3 projects.