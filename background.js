let timeSpent = 0;
let timer;

let limit = 30; // Seconds
const URL = "https://campusgrado.fi.uba.ar/"; // Where it redirects

function isUrl(url) {
  return url.includes("https://twitter.com/") || url.includes("https://www.youtube.com/");
}

function startTimer(tabId) {
  timer = setInterval(() => {
    timeSpent++;
    console.log(`Time spent on Twitter: ${timeSpent} seconds`);
    chrome.tabs.get(tabId, tab => {
      if (isUrl(tab.url) && timeSpent >= limit) {
        chrome.tabs.update(tabId, { url: URL });
        stopTimer();
      }
    });
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.command && msg.command === "getTimeSpent") {
    response({ timeSpent: timeSpent, limit: limit }); // Include the current time limit in the response
  } else if (msg.command && msg.command === "setTimeLimit") {
    limit = msg.timeLimit;
    response({ success: true });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (isUrl(changeInfo.url)) {
      startTimer(tabId);
    } else {
      stopTimer();
    }
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url && isUrl(tab.url)) {
      startTimer(activeInfo.tabId);
    } else {
      stopTimer();
    }
  });
});