const { clickButton, fillTextField, waitForPageLoad } = require('../utils/UIActions')
class AppsPage {
    constructor(page) {
        this.page = page;
        this.searchTextField = "//input[@type='text']";
        this.appSelection = "//div[text()='Github']";
    }

    async selectApp(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.appSelection);
    }

    async searchAppByName(appName){
        await waitForPageLoad(this.page);
        await fillTextField(this.page, this.searchTextField, appName);
    }
}

module.exports = AppsPage;