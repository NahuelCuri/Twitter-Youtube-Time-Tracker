const timeSpentElement = document.getElementById("time-spent");

function updateTimeSpent(timeSpent) {
  timeSpentElement.textContent = timeSpent;
}

chrome.runtime.sendMessage({ command: "getTimeSpent" }, response => {
  updateTimeSpent(response.timeSpent);
});

setInterval(() => {
  chrome.runtime.sendMessage({ command: "getTimeSpent" }, response => {
    updateTimeSpent(response.timeSpent);
  });
}, 1000);