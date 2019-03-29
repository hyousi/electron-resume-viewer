# Electron Resume Viewer

## Development

### Install Dependencies
```bash
yarn
```
In the project directory, you can run:

### Run Dev Mode
Edit `main.js`
```diff
/* main.js */
-   const pkg = { DEV: false }
+   const pkg = { DEV: true }
```
Run separately
```bash
yarn start
yarn electron-start
```

### Build Release
```bash
electron-packager ./ --platform=[...]
```
