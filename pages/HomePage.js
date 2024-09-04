const { clickButton, waitForPageLoad } = require('../utils/UIActions')
class HomePage {
    constructor(page) {
        this.page = page;
        this.toolsCatelogueLocator = "//span[text()='Tools catalogue']";
    }

    async selectToolsCatelogue(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.toolsCatelogueLocator);
    }
}

module.exports = HomePage;