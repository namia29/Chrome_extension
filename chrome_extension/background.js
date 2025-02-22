

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startApplying") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: applyJobs
            });
        });
    }

    if (request.action === "fetchJobs") {
        fetchJobs().then((jobs) => {
            sendResponse({ jobs });
        });
        return true; // Keep connection open for async response
    }
});

// Function to apply for jobs
async function applyJobs() {
    const filters = await new Promise(resolve => {
        chrome.storage.local.get("filters", (data) => resolve(data.filters || {}));
    });

    let appliedJobs = await new Promise(resolve => {
        chrome.storage.local.get("appliedJobs", (data) => resolve(data.appliedJobs || []));
    });

    let jobCards = document.querySelectorAll(".job-card-container");

    for (let job of jobCards) {
        job.click();
        await delay(3000, 5000); // Wait for job details to load

        let applyButton = document.querySelector(".jobs-apply-button");
        if (applyButton) {
            applyButton.click();
            console.log(`Applied for: ${job.innerText}`);

            appliedJobs.push({
                title: job.querySelector(".job-card-list__title")?.innerText || "Unknown",
                company: job.querySelector(".job-card-container__company-name")?.innerText || "Unknown",
                applyLink: job.querySelector("a")?.href || ""
            });

            chrome.storage.local.set({ appliedJobs });

            await delay(5000, 8000); // Random delay after applying
        }
    }
}

// Function to introduce random delay
async function delay(min, max) {
    return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

// Fetch jobs (Simulated data for now)
async function fetchJobs() {
    return [
        { title: "Frontend Developer", company: "Google", location: "Remote", link: "https://linkedin.com/job1" },
        { title: "Backend Developer", company: "Microsoft", location: "NY", link: "https://linkedin.com/job2" }
    ];
}
