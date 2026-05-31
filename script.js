document.getElementById('clickMe').addEventListener('click', function() {
    alert('It works! You just built an app connection!');
});
// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Listen for the phone telling the browser the app is installable
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show your custom install button
  installBtn.style.display = 'block';
});

// Logic when the user clicks your custom button
installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});
// Replace this URL with the actual IP/address of the server running your Python bot
const BOT_SERVER_URL = "http://YOUR_SERVER_IP_OR_URL:8000";

async function triggerTrade(actionType, tradingSymbol, tradeVolume) {
    try {
        const response = await fetch(`${BOT_SERVER_URL}/trade?action=${actionType}&symbol=${tradingSymbol}&volume=${tradeVolume}`, {
            method: 'POST'
        });
        const data = await response.json();
        if (data.status === "Success") {
            alert(`Trade executed successfully! Order ID: ${data.order_id}`);
        } else {
            alert(`Trade failed: ${data.detail}`);
        }
    } catch (error) {
        console.error("Error connecting to trading bot:", error);
        alert("Could not connect to the MetaTrader bot server.");
    }
}

// Example: Trigger this function when your custom scan/upload buttons confirm a pattern
// triggerTrade("BUY", "EURUSD", 0.1);


