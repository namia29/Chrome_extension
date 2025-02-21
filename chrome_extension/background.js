// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "startApplying") {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             chrome.scripting.executeScript({
//                 target: { tabId: tabs[0].id },
//                 function: applyJobs
//             });
//         });
//     }
// });

// async function applyJobs() {
//     const filters = await new Promise(resolve => chrome.storage.local.get("filters", resolve));
    
//     let jobCards = document.querySelectorAll(".job-card-container");
//     jobCards.forEach(async (job) => {
//         job.click();
//         await new Promise(r => setTimeout(r, 3000));  // Wait for job details to load

//         let applyButton = document.querySelector(".jobs-apply-button");
//         if (applyButton) {
//             applyButton.click();
//             console.log(`Applied for: ${job.innerText}`);
//         }
//     });
// }
// async function applyJobs() {
//     const filters = await new Promise(resolve => chrome.storage.local.get("filters", resolve));
    
//     let appliedJobs = await new Promise(resolve => chrome.storage.local.get("appliedJobs", resolve));
//     appliedJobs = appliedJobs.appliedJobs || [];

//     let jobCards = document.querySelectorAll(".job-card-container");
//     jobCards.forEach(async (job) => {
//         job.click();
//         await new Promise(r => setTimeout(r, 3000));  // Wait for job details to load

//         let applyButton = document.querySelector(".jobs-apply-button");
//         if (applyButton) {
//             applyButton.click();
//             console.log(`Applied for: ${job.innerText}`);

//             appliedJobs.push({
//                 title: job.querySelector(".job-card-list__title")?.innerText || "Unknown",
//                 company: job.querySelector(".job-card-container__company-name")?.innerText || "Unknown",
//                 applyLink: job.querySelector("a")?.href || ""
//             });

//             chrome.storage.local.set({ appliedJobs });
//         }
//     });
// }

// async function autoFillForm() {
//     await new Promise(r => setTimeout(r, 3000));  // Wait for form to load

//     let nameField = document.querySelector("input[name='name']");
//     let emailField = document.querySelector("input[type='email']");
//     let phoneField = document.querySelector("input[type='tel']");
//     let submitButton = document.querySelector("button[type='submit']");

//     if (nameField) nameField.value = "John Doe";
//     if (emailField) emailField.value = "johndoe@example.com";
//     if (phoneField) phoneField.value = "+1234567890";

//     if (submitButton) {
//         setTimeout(() => submitButton.click(), 2000); // Delay before clicking Submit
//     }
// }

// async function delay(min, max) {
//     return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
// }

// async function applyJobs() {
//     let jobCards = document.querySelectorAll(".job-card-container");
//     for (let job of jobCards) {
//         job.click();
//         await delay(3000, 5000);  // Wait before checking for Apply button

//         let applyButton = document.querySelector(".jobs-apply-button");
//         if (applyButton) {
//             applyButton.click();
//             console.log(`Applied for: ${job.innerText}`);
//             await delay(5000, 8000);  // Random delay after applying
//         }
//     }
// }

// const userAgents = [
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36",
//     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36"
// ];

// chrome.webRequest.onBeforeSendHeaders.addListener(
//     function(details) {
//         details.requestHeaders.push({ name: "User-Agent", value: userAgents[Math.floor(Math.random() * userAgents.length)] });
//         return { requestHeaders: details.requestHeaders };
//     },
//     { urls: ["*://*.linkedin.com/*"] },
//     ["blocking", "requestHeaders"]
// );

// chrome.runtime.sendMessage({ action: "applyJobs" }, response => console.log(response));


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "applyJobs") {
//         console.log("Received applyJobs action!");
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             chrome.scripting.executeScript({
//                 target: { tabId: tabs[0].id },
//                 function: applyJobs
//             });
//         });
//     }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "fetchJobs") {
//         fetchJobs().then((jobs) => {
//             sendResponse({ jobs });
//         });
//         return true; // Keep the connection open for async response
//     }
// });

// async function fetchJobs() {
//     // Simulated job data (replace this with LinkedIn scraping or API call)
//     return [
//         { title: "Frontend Developer", company: "Google", location: "Remote", link: "https://linkedin.com/job1" },
//         { title: "Backend Developer", company: "Microsoft", location: "NY", link: "https://linkedin.com/job2" }
//     ];
// }


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
