// Fetch proxy list from GeoNode API
async function fetchProxies() {
    try {
        const response = await fetch('https://proxylist.geonode.com/api/proxy-list?limit=10&page=1&sort_by=latency&sort_type=asc');
        const data = await response.json();
        return data.data.map(proxy => ({
            scheme: proxy.protocols[0], // http, https, etc.
            host: proxy.ip,
            port: parseInt(proxy.port, 10)
        }));
    } catch (error) {
        console.error('Error fetching proxies:', error);
        return [];
    }
}

// Function to test if the proxy is working by making a request
function testProxy(proxyConfig) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.ipify.org?format=json'; // Service to get public IP, useful for proxy testing
        const config = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: proxyConfig.scheme,
                    host: proxyConfig.host,
                    port: proxyConfig.port
                },
                bypassList: ["localhost", "127.0.0.1", "::1"]
            }
        };

        chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error setting proxy for test:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Proxy Test: Public IP:', data.ip);
                        resolve(true);  // Proxy is working
                    })
                    .catch(error => {
                        console.error('Proxy Test failed:', error);
                        resolve(false);  // Proxy is not working
                    })
                    .finally(() => {
                        // Clear the proxy settings after the test
                        chrome.proxy.settings.clear({ scope: 'regular' }, () => {
                            console.log('Proxy test completed, settings cleared.');
                        });
                    });
            }
        });
    });
}

// Function to set proxy after testing
async function setProxy() {
    const proxies = await fetchProxies();

    for (let proxyConfig of proxies) {
        const isWorking = await testProxy(proxyConfig);
        if (isWorking) {
            console.log('Found working proxy:', proxyConfig);

            const config = {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: proxyConfig.scheme,
                        host: proxyConfig.host,
                        port: proxyConfig.port
                    },
                    bypassList: ["localhost", "127.0.0.1", "::1"]
                }
            };

            return new Promise((resolve, reject) => {
                chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error setting proxy:', chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    } else {
                        chrome.storage.sync.set({ activeProxy: proxyConfig }, () => {
                            console.log('Proxy set successfully:', proxyConfig);
                            resolve(proxyConfig);
                        });
                    }
                });
            });
        }
    }

    throw new Error('No working proxy found');
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
        setProxy()
            .then((proxyConfig) => sendResponse({ status: 'success', proxyConfig }))
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
