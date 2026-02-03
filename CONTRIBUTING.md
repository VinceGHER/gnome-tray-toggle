# Contributing to GNOME Tray Toggle

Thank you for considering contributing to GNOME Tray Toggle! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your GNOME Shell version (`gnome-shell --version`)
- Your OS and desktop environment

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear description of the feature
- Why it would be useful
- Any implementation ideas you might have

### Code Contributions

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone git@github.com:yourusername/gnome-tray-toggle.git
   cd gnome-tray-toggle
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**:
   - Follow the existing code style
   - Use ES6+ JavaScript features
   - Comment complex logic
   - Test thoroughly

5. **Test your changes**:
   ```bash
   make install
   # Restart GNOME Shell
   gnome-extensions enable tray-toggle@maciek
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** on GitHub

## Development Setup

### Prerequisites

- GNOME Shell 47 or later
- git
- Basic knowledge of JavaScript and GNOME Shell extensions

### Testing

```bash
# Install extension locally
make install

# View logs
make logs

# Reload extension after changes
make reload
```

## Code Style

- Use 4 spaces for indentation
- Use single quotes for strings (unless escaping needed)
- Use meaningful variable names
- Add comments for complex logic
- Follow GNOME Shell extension best practices

## Questions?

Feel free to open an issue for any questions or discussions!
