chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "applyJobs") {
        let jobs = [...document.querySelectorAll(".job-card-container")].map(job => ({
            title: job.querySelector(".job-card-list__title")?.innerText || "Unknown",
            company: job.querySelector(".job-card-container__company-name")?.innerText || "Unknown",
            applyLink: job.querySelector("a")?.href || ""
        }));
        sendResponse({ jobs });
    }
    console.log("Content script running...");
});
