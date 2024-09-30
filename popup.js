document.addEventListener('DOMContentLoaded', function() {
    const regionSelect = document.getElementById('regionSelect');
    const setProxyButton = document.getElementById('setProxy');
    const clearProxyButton = document.getElementById('clearProxy');
    const statusDiv = document.getElementById('status');
  
    // Load active proxy on popup open
    chrome.runtime.sendMessage({ action: 'getActiveProxy' }, function(response) {
      if (response.activeProxy) {
        regionSelect.value = response.activeProxy;
        updateStatus(`Connected to: ${response.activeProxy.toUpperCase()}`, 'success');
      } else {
        updateStatus('Not connected to any proxy', 'info');
      }
    });
  
    setProxyButton.addEventListener('click', function() {
      const region = regionSelect.value;
      if (!region) {
        updateStatus('Please select a region', 'error');
        return;
      }
  
      chrome.runtime.sendMessage({ action: 'setProxy', region }, (response) => {
        if (response.status === 'success') {
          updateStatus(`Connected to: ${response.region.toUpperCase()}`, 'success');
        } else {
          updateStatus(`Failed to set proxy: ${response.message}`, 'error');
        }
      });
    });
  
    clearProxyButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'clearProxy' }, (response) => {
        if (response.status === 'success') {
          regionSelect.value = '';
          updateStatus('Proxy cleared successfully', 'success');
        } else {
          updateStatus(`Failed to clear proxy: ${response.message}`, 'error');
        }
      });
    });
  
    function updateStatus(message, type) {
      statusDiv.textContent = message;
      statusDiv.className = `status ${type}`;
      console.log(`Status updated: ${message} (${type})`);
    }
  });