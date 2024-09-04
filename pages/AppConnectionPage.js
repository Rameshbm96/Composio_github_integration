const { clickButton, waitForPageLoad } = require('../utils/UIActions')
class AppConnectionPage {
    constructor(page) {
        this.page = page;
        this.addAccountButton = "(//button[text()='Add account'])[1]";
        this.connectToAppPopup = "//div[@role='alertdialog']";
        this.connectToAppButton = "//div[@role='alertdialog']//button";
    }

    async performAppConnection() {
        await waitForPageLoad(this.page);
        if(await this.page.locator(this.connectToAppPopup).isVisible()){
            await clickButton(this.page, this.connectToAppButton);
        }else{
            await clickButton(this.page, this.addAccountButton);
            await clickButton(this.page, this.connectToAppButton);
        }
    }
}

module.exports = AppConnectionPage;