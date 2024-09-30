document.addEventListener('DOMContentLoaded', async function() {
    const setProxyButton = document.getElementById('setProxy');
    const clearProxyButton = document.getElementById('clearProxy');
    const statusDiv = document.getElementById('status');

    // Load active proxy on popup open
    chrome.runtime.sendMessage({ action: 'getActiveProxy' }, function(response) {
        if (response.activeProxy) {
            updateStatus(`Connected to: ${response.activeProxy.host}:${response.activeProxy.port}`, 'success');
        } else {
            updateStatus('Not connected to any proxy', 'info');
        }
    });

    // Set proxy button click handler
    setProxyButton.addEventListener('click', function() {
        updateStatus('Testing proxies and setting a working one...', 'info');

        chrome.runtime.sendMessage({ action: 'setProxy' }, (response) => {
            console.log('Response from background script:', response);

            if (response.status === 'success') {
                updateStatus(`Connected to: ${response.proxyConfig.host}:${response.proxyConfig.port}`, 'success');
            } else {
                updateStatus(`Failed to set proxy: ${response.message}`, 'error');
            }
        });
    });

    // Clear proxy button click handler
    clearProxyButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'clearProxy' }, (response) => {
            if (response.status === 'success') {
                updateStatus('Proxy cleared successfully', 'success');
            } else {
                updateStatus(`Failed to clear proxy: ${response.message}`, 'error');
            }
        });
    });

    // Function to update the status message in the popup
    function updateStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`; // Update the class for styling
        console.log(`Status updated: ${message} (${type})`);
    }
});
