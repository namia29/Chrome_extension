// // document.getElementById("start").addEventListener("click", () => {
// //     const filters = {
// //         keywords: document.getElementById("keywords").value,
// //         location: document.getElementById("location").value,
// //         experience: document.getElementById("experience").value
// //     };

// //     chrome.storage.local.set({ filters }, () => {
// //         chrome.runtime.sendMessage({ action: "startApplying" });
// //     });

// //     document.addEventListener("DOMContentLoaded", () => {
// //         const startBtn = document.getElementById("startApplying");
    
// //         if (startBtn) {
// //             startBtn.addEventListener("click", () => {
// //                 console.log("Start Applying button clicked!");
// //                 chrome.runtime.sendMessage({ action: "applyJobs" });
// //             });
// //         } else {
// //             console.error("Start Applying button not found!");
// //         }
// //     });
// // });


// document.addEventListener("DOMContentLoaded", () => {
//     const startBtn = document.getElementById("start");

//     if (startBtn) {
//         startBtn.addEventListener("click", () => {
//             const filters = {
//                 keywords: document.getElementById("keywords").value,
//                 location: document.getElementById("location").value,
//                 experience: document.getElementById("experience").value
//             };

//             chrome.storage.local.set({ filters }, () => {
//                 chrome.runtime.sendMessage({ action: "startApplying" });
//             });
//         });
//     } else {
//         console.error("Start button not found!");
//     }

//     // "Start Applying" button event listener
//     const startApplyingBtn = document.getElementById("startApplying");

//     if (startApplyingBtn) {
//         startApplyingBtn.addEventListener("click", () => {
//             console.log("Start Applying button clicked!");
//             chrome.runtime.sendMessage({ action: "applyJobs" });
//         });
//     } else {
//         console.error("Start Applying button not found!");
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start");

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            const filters = {
                keywords: document.getElementById("keywords").value,
                location: document.getElementById("location").value,
                experience: document.getElementById("experience").value
            };

            chrome.storage.local.set({ filters }, () => {
                chrome.runtime.sendMessage({ action: "startApplying" });
            });
        });
    } else {
        console.error("Start button not found!");
    }

    const startApplyingBtn = document.getElementById("startApplying");

    if (startApplyingBtn) {
        startApplyingBtn.addEventListener("click", () => {
            console.log("Start Applying button clicked!");
            
            // Request jobs from background script
            chrome.runtime.sendMessage({ action: "fetchJobs" }, (response) => {
                if (response && response.jobs) {
                    displayJobs(response.jobs);
                } else {
                    console.error("No jobs found!");
                }
            });
        });
    } else {
        console.error("Start Applying button not found!");
    }
});

// Function to display jobs in popup
function displayJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = ""; // Clear previous results

    jobs.forEach((job) => {
        const jobItem = document.createElement("div");
        jobItem.innerHTML = `
            <h3>${job.title}</h3>
            <p>${job.company} - ${job.location}</p>
            <a href="${job.link}" target="_blank">View Job</a>
            <hr>
        `;
        jobList.appendChild(jobItem);
    });
}
