document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("appliedJobs", (data) => {
        const jobs = data.appliedJobs || [];
        const tableBody = document.getElementById("jobs-list");

        jobs.forEach(job => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${job.title}</td>
                <td>${job.company}</td>
                <td><a href="${job.applyLink}" target="_blank">View</a></td>
            `;
            tableBody.appendChild(row);
        });
    });
});