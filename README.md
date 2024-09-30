# Proxy Extension

A Chrome extension that allows users to easily switch between different proxy servers for secure browsing.

Note: To work you have to provide the proxy server details in the `background.js` file.

## Requirements

- Google Chrome browser

## Dependencies

- None

## Structure

- `manifest.json`: Extension metadata
- `background.js`: Background script that handles proxy settings
- `popup.html`: Popup window for user interaction
- `popup.js`: JavaScript code for the popup window
- `styles.css`: CSS styles for the popup window

## Functionality

The extension works by using the Chrome extension API to set and clear proxy settings. When the user selects a region, the extension sets the system proxy to the corresponding server address. When the user clicks "Clear Proxy", the extension clears the system proxy settings.

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

## Configuration

- **Proxy servers:** Update the `proxyServers` object in `background.js` with your desired proxy server addresses and regions.
- **Permissions:** Ensure that the `manifest.json` file includes the necessary permissions for the extension to work correctly.

## Notes

- The extension uses the system proxy settings, so it may not work if your system proxy is already configured.
- The extension does not guarantee anonymity or security. It is recommended to use a VPN for more secure browsing.
- The extension is provided "as is" without any warranty. Use at your own risk.

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

## Disclaimer

This extension is for educational purposes only and should not be used for any illegal activities. The author is not responsible for any misuse of this extension.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).