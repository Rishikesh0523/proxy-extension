// Proxy configurations
const proxyConfigs = {
    us: { scheme: 'https', host: 'us.proxy.example.com', port: 8080 },
    uk: { scheme: 'https', host: 'uk.proxy.example.com', port: 8080 },
    de: { scheme: 'https', host: 'de.proxy.example.com', port: 8080 },
    jp: { scheme: 'https', host: 'jp.proxy.example.com', port: 8080 },
    au: { scheme: 'https', host: 'au.proxy.example.com', port: 8080 }
};

// ... rest of the background.js code remains the same

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ activeProxy: null });
});

// Function to set proxy
function setProxy(region) {
    const proxyConfig = proxyConfigs[region];
    if (!proxyConfig) {
        return Promise.reject(new Error('Invalid region'));
    }

    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: proxyConfig,
            bypassList: ["localhost", "127.0.0.1", "::1"]
        }
    };

    return new Promise((resolve, reject) => {
        chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error setting proxy:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                chrome.storage.sync.set({ activeProxy: region }, () => {
                    console.log('Proxy set successfully to:', region);
                    resolve(region);
                });
            }
        });
    });
}

// Function to clear proxy settings
function clearProxy() {
    return new Promise((resolve, reject) => {
        chrome.proxy.settings.clear({ scope: 'regular' }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing proxy:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                chrome.storage.sync.set({ activeProxy: null }, () => {
                    console.log('Proxy cleared successfully');
                    resolve();
                });
            }
        });
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.action === 'setProxy') {
        setProxy(request.region)
            .then((region) => sendResponse({ status: 'success', region }))
            .catch((error) => sendResponse({ status: 'error', message: error.message }));
        return true; // Keep the message channel open for asynchronous response
    } else if (request.action === 'clearProxy') {
        clearProxy()
            .then(() => sendResponse({ status: 'success' }))
            .catch((error) => sendResponse({ status: 'error', message: error.message }));
        return true; // Keep the message channel open for asynchronous response
    } else if (request.action === 'getActiveProxy') {
        chrome.storage.sync.get('activeProxy', (data) => {
            console.log('Current active proxy:', data.activeProxy);
            sendResponse({ activeProxy: data.activeProxy });
        });
        return true; // Keep the message channel open for asynchronous response
    }
});