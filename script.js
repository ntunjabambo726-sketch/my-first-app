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

<div class="trading-controls" style="text-align: center; margin-top: 20px;">
    <button id="buyBtn" style="background-color: #2ecc71; color: white; padding: 15px 30px; font-size: 18px; border: none; border-radius: 5px; margin: 10px; cursor: pointer;">
        BUY EURUSD
    </button>
    <button id="sellBtn" style="background-color: #e74c3c; color: white; padding: 15px 30px; font-size: 18px; border: none; border-radius: 5px; margin: 10px; cursor: pointer;">
        SELL EURUSD
    </button>
</div>


