// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { HackerNewsPage } = require("./HackerNewsPage");

async function sortHackerNewsArticles() {

  let browser;
  let result;

  try {
    // launch browser
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    const hackerNewsPage = new HackerNewsPage(page);

    // go to Hacker News
    const response = await page.goto("https://news.ycombinator.com/newest");

    if (!response.ok()) {
      throw new Error(`Error loading page. Error code ${response.status}`);
    }

    // grab article timestamps
    await hackerNewsPage.getArticleTimestamps();

    // see if the timestamps are ordered newest to oldest
    await hackerNewsPage.compareTimes();

    // output results
    await hackerNewsPage.showResults();

    // create object literal
    result = {
      isChronological: hackerNewsPage.isChronological,
      passed: hackerNewsPage.passedCount,
      failed: hackerNewsPage.failedCount,
      times: hackerNewsPage.times,
      duration: hackerNewsPage.executionTime,
      successRate: hackerNewsPage.successRate,
      newestDate: hackerNewsPage.newestDate.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit"
      }),
      oldestDate: hackerNewsPage.oldestDate.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit"
      }),
    }

    // return result to server
    return result;

  } catch (error) {
    // return error to server
    console.error(error.message);
    return { error: error.message };

  } finally {
    // close browser
    if (browser) {
      await browser.close();
    }

  }
}

// export function to be used in server.js
module.exports = { sortHackerNewsArticles };

(async () => {
  await sortHackerNewsArticles();
})();
