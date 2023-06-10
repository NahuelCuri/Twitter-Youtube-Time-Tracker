const timeSpentElement = document.getElementById("time-spent");
const setLimitButton = document.getElementById("set-limit");
//const timeLimitInput = document.getElementById("time-limit");

function updateTimeSpent(timeSpent) {
  timeSpentElement.textContent = timeSpent;
}

function setNewTimeLimit() {
  const newTimeLimit = parseInt(timeLimitInput.value, 10);
  if (!isNaN(newTimeLimit) && newTimeLimit >= 1) {
    chrome.runtime.sendMessage({ command: "setTimeLimit", timeLimit: newTimeLimit });
  }
}
function setTimeLimit(limit) {
  chrome.runtime.sendMessage({ command: "setTimeLimit", timeLimit: limit }, response => {
    if (response.success) {
      console.log("Time limit updated successfully");
    } else {
      console.log("Failed to update time limit");
    }
  });
}

chrome.runtime.sendMessage({ command: "getTimeSpent" }, response => {
  updateTimeSpent(response.timeSpent);
});

setLimitButton.addEventListener("click", setNewTimeLimit);

setInterval(() => {
  chrome.runtime.sendMessage({ command: "getTimeSpent" }, response => {
    updateTimeSpent(response.timeSpent);
  });
}, 1000);

// Event listener for the input field to update the time limit
const timeLimitInput = document.getElementById("time-limit-input");
timeLimitInput.addEventListener("change", () => {
  const newLimit = parseInt(timeLimitInput.value);
  if (!isNaN(newLimit)) {
    setTimeLimit(newLimit);
  }
});