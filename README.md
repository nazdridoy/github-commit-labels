# GitHub Commit Labels

A userscript that enhances GitHub commits by adding beautiful labels for conventional commit types. It automatically detects commit types (like feat, fix, docs) and adds visually appealing labels to make your commit history more readable.

[![Install GitHub Commit Labels](https://img.shields.io/badge/Install-GitHub%20Commit%20Labels-brightgreen?style=for-the-badge)](https://greasyfork.org/en/scripts/526153-github-commit-labels)

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
- ⚠️ Special highlighting for BREAKING CHANGES (using `type!:` or `type(scope)!:`)

## Try it on these repositories

After installing the script, check it out on these repositories with conventional commits:

- [Refined GitHub Sandbox - https://github.com/refined-github/sandbox/commits/conventional-commits/](https://github.com/refined-github/sandbox/commits/conventional-commits/)
- [NGPT - https://github.com/nazdridoy/ngpt/commits/main/](https://github.com/nazdridoy/ngpt/commits/main/)
- [Kokoro TTS - https://github.com/nazdridoy/kokoro-tts/commits/main](https://github.com/nazdridoy/kokoro-tts/commits/main)
- [Standard Version - https://github.com/conventional-changelog/standard-version/commits](https://github.com/conventional-changelog/standard-version/commits)

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
  
## Example Commit Formats

Here are some examples of how to format your commits to get the labels:

```
# Basic format
feat: add new login functionality
fix: resolve authentication bug
docs: update API documentation

# With scope
feat(auth): implement OAuth2 login
fix(api): handle rate limiting errors
feat!(auth): implement breaking change in auth
refactor!(parser): rewrite parser logic (breaking change)
docs(readme): add installation guide
style(button): improve hover effects
refactor(service): clean up user service code
perf(db): optimize database queries
test(auth): add unit tests for auth service
```

The script will automatically detect the commit type from the first word of your commit message and add the appropriate label. Make sure to:
1. Use one of the supported commit types or their aliases
2. Follow the format: `type(scope): description` or `type: description`
3. Indicate **breaking changes** by adding `!` after the type or scope: `type!:` or `type(scope)!:`.
4. Keep the commit message clear and concise
5. Use meaningful scopes that describe the area of the codebase being changed

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

