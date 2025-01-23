<!-- markdownlint-disable MD041 -->
[![GitHub](https://img.shields.io/github/license/AdrianDAlessandro/rse-competencies-toolkit-webapp)](https://raw.githubusercontent.com/AdrianDAlessandro/rse-competencies-toolkit-webapp/main/LICENSE)
[![Test and build](https://github.com/AdrianDAlessandro/rse-competencies-toolkit-webapp/actions/workflows/ci.yml/badge.svg)](https://github.com/AdrianDAlessandro/rse-competencies-toolkit-webapp/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/AdrianDAlessandro/rse-competencies-toolkit-webapp/graph/badge.svg?token=56K64XN243)](https://codecov.io/gh/AdrianDAlessandro/rse-competencies-toolkit-webapp)

# RSE Competencies Toolkit

A Django webapp for hosting the RSE Competencies Toolkit.

This Django project uses:

- [`pip-tools`] for packaging and dependency management.
- [`pre-commit`](https://pre-commit.com/) for various linting, formatting and static type checking. Pre-commit hooks are automatically kept updated with [pre-commit.ci](https://pre-commit.ci).
- [`pytest`](https://pytest.org/) and [GitHub Actions](https://github.com/features/actions).

[`pip-tools`] is chosen as a lightweight dependency manager that adheres to the [latest standards](https://peps.python.org/pep-0621/) using `pyproject.toml`.

## Installation

To get started:

1. Create and activate a [virtual environment](https://docs.python.org/3/library/venv.html):

   ```bash
   python -m venv .venv
   source .venv/bin/activate # with Powershell on Windows: `.venv\Scripts\Activate.ps1`
   ```

2. Install development requirements:

   ```bash
   pip install -r dev-requirements.txt
   ```

3. (Optionally) install tools for building documentation:

   ```bash
   pip install -r doc-requirements.txt
   ```

4. Install the git hooks:

   ```bash
   pre-commit install
   ```

5. Run the webapp:

   ```bash
   python manage.py runserver
   ```

   When running the webapp for the first time you may get a warning similar to:

   `You have 19 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, main, sessions.`

   If this is the case, stop your webapp (with CONTROL-C) and apply the migrations with:

   ```bash
   python manage.py migrate
   ```

   then restart it.

6. Run the tests:

   ```bash
   pytest
   ```

7. Create an admin account to access admin backend:

   ```bash
   python manage.py createsuperuser
   ```

### Installation with Docker

The app can be run within a Docker container and a `docker-compose.yml` file is provided to make this easy for development.

Ensure you have [Docker](https://docs.docker.com/desktop/) installed and simply run:

```bash
docker compose up
```

The app will be available at <http://127.0.0.1:8000/> <!-- markdown-link-check-disable-line -->

## Updating Dependencies

To add or remove dependencies:

1. Edit the `dependencies` variables in the `pyproject.toml` file (aim to keep development tools separate from the project requirements).
2. Update the requirements files:
   - `pip-compile` for `requirements.txt` - the project requirements.
   - `pip-compile --extra dev -o dev-requirements.txt` for the development requirements.
   - `pip-compile --extra doc -o doc-requirements.txt` for the documentation tools.
3. Sync the files with your installation (install packages):
   - `pip-sync *requirements.txt`

To upgrade pinned versions, use the `--upgrade` flag with `pip-compile`.

Versions can be restricted from updating within the `pyproject.toml` using standard python package version specifiers, i.e. `"black<23"` or `"pip-tools!=6.12.2"`

[`pip-tools`]: https://pip-tools.readthedocs.io/en/latest/

## Working with NPM

This project includes an NPM-based setup for managing front-end assets like styles, scripts, and other resources. The `package.json` file contains predefined scripts to help with building and managing assets. You don't need to run these NPM commands if you are developing the Django app locally. You should only run these commands when needed, for example if you are changing javascript dependencies or modifying SCSS files.

### Prerequisites

Ensure you have Node.js (v16 or higher) and NPM installed. You can verify their installation with:

```bash
npm -v
```

### Installing Dependencies

After cloning the repository, navigate to the project directory and install the required NPM dependencies:

```bash
npm install
```

### Available NPM Scripts

Key commands available in the `package.json`:

***Build All Assets:*** To build all styles, scripts, icon fonts, and vendor files, run:

```bash
npm build
```

***Build Expanded Styles:*** To build expanded (human-readable) css files:

```bash
npm run styles:expanded
```

***Build Minified Styles:*** To build minified (optimised for production) css files:

```bash
npm run styles:minified
```

***Build Expanded Scripts:*** To build expanded (human-readable) javascript file:

```bash
npm run scripts:expanded
```

***Build Minified Styles:*** To build minified (optimised for production) javascript file:

```bash
npm run scripts:minified
```

***Build Icon Fonts:*** Generate custom icon fonts from SVG files:

```bash
npm run icon-font
```

***Build Vendor Files:*** Bundle and optimise third-party libraries:

```bash
npm run vendor
```
