let timeSpent = 0;
let timer;

const LIMIT = 10; // Seconds
const URL = "https://www.facebook.com" // Where it redirects

function startTimer(tabId) {
  timer = setInterval(() => {
    timeSpent++;
    console.log(`Time spent on Twitter: ${timeSpent} seconds`);
    if (timeSpent >= LIMIT) {
      chrome.tabs.update(tabId, { url: URL });
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (changeInfo.url.includes("twitter.com") || changeInfo.url.includes("youtube.com")) {
      startTimer(tabId);
    } else {
      stopTimer();
    }
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url && tab.url.includes("twitter.com")) {
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