let timeSpent = 0;
let timer;

const LIMIT = 10; // Seconds
const URL = "https://campusgrado.fi.uba.ar/"; // Where it redirects

function isTwitterUrl(url) {
  return url.includes("https://twitter.com/");
}

function startTimer(tabId) {
  timer = setInterval(() => {
    timeSpent++;
    console.log(`Time spent on Twitter: ${timeSpent} seconds`);
    chrome.tabs.get(tabId, tab => {
      if (isTwitterUrl(tab.url) && timeSpent >= LIMIT) {
        chrome.tabs.update(tabId, { url: URL });
        stopTimer();
      }
    });
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (isTwitterUrl(changeInfo.url)) {
      startTimer(tabId);
    } else {
      stopTimer();
    }
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url && isTwitterUrl(tab.url)) {
      startTimer(activeInfo.tabId);
    } else {
      stopTimer();
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.command && msg.command === "getTimeSpent") {
    response({ timeSpent: timeSpent });
  }
});
