# Secure Proxy Extension

A Chrome extension that allows users to easily switch between different proxy servers for secure browsing.

## Features

- Select from multiple proxy server regions (US, UK, Germany)
- Easily set and clear proxy settings
- Remembers the last active proxy connection
- Clean and intuitive user interface

## Installation

1. Clone this repository or download it as a ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup.
2. Select a region from the dropdown menu.
3. Click "Set Proxy" to connect to the selected proxy server.
4. To disconnect, click "Clear Proxy".

The extension will remember your last connection and display it when you open the popup.

## Development

To modify the extension:

1. Update the proxy configurations in `background.js` if you want to add or change proxy servers.
2. Modify `popup.html` and `styles.css` to change the user interface.
3. Update `popup.js` to add new functionality to the popup.
4. If you add new permissions or features, update `manifest.json` accordingly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).