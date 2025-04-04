# GitHub Commit Labels

A userscript that enhances GitHub commits by adding beautiful labels for conventional commit types. It automatically detects commit types (like feat, fix, docs) and adds visually appealing labels to make your commit history more readable.


## Features

- 🏷️ Adds beautiful labels to conventional commit messages
- 🎨 GitHub-style design that matches the platform
- 🌓 Automatic theme detection (light, dark, and dark dimmed)
- 💬 Informative tooltips showing detailed descriptions
- 👆 Toggle button to quickly show/hide labels
- 📤 Export/Import configurations for team sharing
- ⚙️ Fully customizable through a user-friendly configuration panel
- 🔄 Supports multiple aliases for each commit type
- 🎯 Works on commit history and single commit pages


![preview1](https://raw.githubusercontent.com/nazdridoy/github-commit-labels/main/previews/preview1.png)



## Supported Commit Types

Default commit types and their aliases:

- **Feature**: `feat`, `feature`
- **Added**: `added`, `add`
- **Updated**: `update`, `updated`
- **Removed**: `removed`, `remove`
- **Fix**: `fix`, `bugfix`, `fixed`
- **Hot Fix**: `hotfix`
- **Documentation**: `docs`, `doc`, `documentation`
- **Style**: `style`, `css`
- **UI**: `ui`
- **Refactor**: `refactor`
- **Performance**: `perf`, `performance`
- **Optimize**: `optimize`
- **Test**: `test`, `tests`, `testing`
- **Build**: `build`
- **CI/CD**: `ci`, `cd`
- **Deploy**: `deploy`, `release`
- **Dependencies**: `deps`, `dep`, `dependencies`
- **Chore**: `chore`
- **Revert**: `revert`
- **WIP**: `wip`
- **Security**: `security`
- **Internationalization**: `i18n`
- **Accessibility**: `a11y`
- **API**: `api`
- **Database**: `data`
- **Configuration**: `config`
- **Initial Setup**: `init`
- **You Can ADD More**
  
## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
   - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
   - [Violentmonkey](https://violentmonkey.github.io/)

2. Install the script:
   - [Install from Greasy Fork](https://greasyfork.org/en/scripts/526153-github-commit-labels)
   - Or create a new script in your userscript manager and copy the contents of [`github-commit-labels.js`](https://github.com/nazdridoy/github-commit-labels/blob/main/github-commit-labels.js)

## Configuration

1. Click on your userscript manager's icon
2. Select "GitHub Commit Labels" > "Configure Commit Labels"
3. Customize:
   - Add/remove commit types
   - Edit aliases
   - Change emojis
   - Modify colors
   - Toggle prefix removal
   - Enable/disable tooltips
   - Show/hide floating toggle button
   - Export/Import your configuration
  

![preview2](https://raw.githubusercontent.com/nazdridoy/github-commit-labels/main/previews/preview2.png)



## Development

To contribute or modify the script:

1. Clone the repository:
```bash
git clone https://github.com/nazdridoy/github-commit-labels.git
```

2. Make your changes to `github-commit-labels.js`

3. Test the script by loading it in your userscript manager

4. Submit a pull request with your changes

## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

Created by [nazdridoy](https://github.com/nazdridoy)

## Support

If you encounter any issues or have suggestions:
- [Open an issue](https://github.com/nazdridoy/github-commit-labels/issues)
- [Submit a pull request](https://github.com/nazdridoy/github-commit-labels/pulls)

