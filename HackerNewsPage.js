class HackerNewsPage {
    constructor(page) {
        this.page = page; // initialize page
        this.ageElements = page.locator('.age'); // locates timestamps
        this.morelink = page.locator('.morelink'); // locates the link to next page
        this.times = []; // will hold timestamps
        this.count = 0; // used for iterating through the posts
        this.loopCount = 0; // tracks the amount of comparisons performed
        this.isChronological = true; // will switch to false when posts are determined to be out of order
        this.passedCount = 0; // track passing comparisons
        this.failedCount = 0; // track failed comparisons
        this.successRate = 0; // calculate passed comparisons divided by total comparisons times 100
        this.startTime = null; // tracks when first function is called
        this.endTime = null; // tracks when last function is called
        this.executionTime = null; // execution time of script (endTime - startTime)
        this.newestDate = null; // newest date checked
        this.oldestDate = null; // oldest date checked
    }

    async getArticleTimestamps() {
        // get current time
        this.startTime = Date.now();
        // iterate posts and add to times[] until next page is needed
        for (let i = 0; i < 100; i++) {

            if (this.count < 29) {
                let title = await this.ageElements.nth(this.count).getAttribute('title');
                this.times.push(title.split(' ')[0]);
                this.count++;
            } else {
                let title = await this.ageElements.nth(this.count).getAttribute('title');
                this.times.push(title.split(' ')[0]);
                await this.getNextPage();
                this.count = 0;
            }
        }
        
    }

    async getNextPage() {
        // go to next page, wait for it to fully load, then relocate the timestamps
        await this.morelink.click();
        await this.page.waitForLoadState('domcontentloaded');
        this.ageElements = this.page.locator('.age');
    }

    async compareTimes() {
        // convert to date objects and determine which is newer
        for (let i = 0; i < 99; i++) {
            this.loopCount++;
            let date1 = new Date(this.times[i]);
            let date2 = new Date(this.times[i + 1]);

            if (date1 >= date2) {
                this.passedCount++;
            } else {
                this.isChronological = false;
                this.failedCount++;
                console.log('Comparison failed: ', i, date1, i + 1, date2);
            }
        }
    }

    async showResults() {
        // calculate execution time
        this.endTime = Date.now();
        this.executionTime = (this.endTime - this.startTime);
        //output results
        this.newestDate = new Date(this.times[0]);
        this.oldestDate = new Date(this.times[99]);
        this.successRate = (this.passedCount / (this.times.length - 1)) * 100;

        console.log("\t\t\t\t\t    _____                 _ _       ");
        console.log("\t\t\t\t\t   |  __ \\               | | |      ");
        console.log("\t\t\t\t\t   | |__) |___  ___ _   _| | |_ ___ ");
        console.log("\t\t\t\t\t   |  _  // _ \\/ __| | | | | __/ __|");
        console.log("\t\t\t\t\t   | | \\ \\  __/\\__ \\ |_| | | |_\\__ \\");
        console.log("\t\t\t\t\t   |_|  \\_\\___||___/\\__,_|_|\\__|___/");
        console.log("\t\t\t\t\t                                    ");
        console.log("\t\t\t\t\t                                    ");

        if (this.isChronological) {
            console.log('\n\t\t\t\t It is ✅', this.isChronological, 'that the posts are in chronological order.');
        } else {
            console.log('\n\t\t\t\t It is ❌', this.isChronological, 'that the posts are in chronological order.');
        }

        console.log('\n\t\t\t\t     Total number of comparisons passed:', this.passedCount, '/ ', this.loopCount);
        console.log('\t\t\t\t     Total number of comparisons failed:', this.failedCount, ' / ', this.loopCount);
        console.log('\t\t\t\t     Newest article checked:', this.newestDate);
        console.log('\t\t\t\t     Oldest article checked:', this.oldestDate);
        console.log('\t\t\t\t\t\t  Success Rate:', this.successRate,'%');
        console.log('\t\t\t\t\t    Total execution time: ', this.executionTime, 'ms \n\n');
    }
}

module.exports = { HackerNewsPage };