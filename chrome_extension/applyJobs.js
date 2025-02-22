

require("dotenv").config();
const puppeteer = require("puppeteer");

(async function applyJobs() {  // 👈 Wrapped in an async IIFE
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Log in to LinkedIn
    await page.goto("https://www.linkedin.com/login", { waitUntil: "networkidle2" });
    await page.type("#username", process.env.LINKEDIN_EMAIL, { delay: 50 });
    await page.type("#password", process.env.LINKEDIN_PASSWORD, { delay: 50 });
    await page.click('[type="submit"]');
    await page.waitForNavigation();

    // Job search filters
    const filters = {
        keywords: "Frontend Developer",
        location: "Remote",
        experience: "1-3 years"
    };

    const jobSearchURL = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(filters.keywords)}&location=${encodeURIComponent(filters.location)}`;
    await page.goto(jobSearchURL, { waitUntil: "networkidle2" });

    // Get job listings
    const jobLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".jobs-search-results__list a"))
            .map(link => link.href)
            .slice(0, 10); // Apply to first 10 jobs
    });

    let appliedJobs = [];

    for (let jobLink of jobLinks) {
        console.log(`Applying to: ${jobLink}`);
        await page.goto(jobLink, { waitUntil: "networkidle2" });

        // Check if already applied
        if (appliedJobs.includes(jobLink)) {
            console.log("Already applied to this job, skipping.");
            continue;
        }

        // Click on Easy Apply button if available
        const applyButton = await page.$(".jobs-apply-button");
        if (applyButton) {
            await applyButton.click();
            await page.waitForTimeout(2000);

            // Auto-fill application form
            await autoFillForm(page);
            appliedJobs.push(jobLink); // Save applied job
        } else {
            console.log("Easy Apply not available for this job.");
        }
    }

    console.log("Finished applying for jobs.");
    await browser.close();
})();

async function autoFillForm(page) {
    try {
        // Wait for form fields
        await page.waitForSelector("input, button", { timeout: 5000 });

        const nameField = await page.$("input[name='name']");
        const emailField = await page.$("input[type='email']");
        const phoneField = await page.$("input[type='tel']");
        const submitButton = await page.$("button[type='submit']");

        if (nameField) await nameField.type("John Doe", { delay: 50 });
        if (emailField) await emailField.type("johndoe@example.com", { delay: 50 });
        if (phoneField) await phoneField.type("+1234567890", { delay: 50 });

        if (submitButton) {
            console.log("Submitting application...");
            await submitButton.click();
            await page.waitForTimeout(3000);
        }
    } catch (error) {
        console.log("Error filling the application form:", error.message);
    }
}
