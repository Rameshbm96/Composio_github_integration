const { clickButton, waitForPageLoad } = require('../utils/UIActions')
class AppPage {
    constructor(page) {
        this.page = page;
        this.setupIntegrationButton = "//div[text()='Category']/../following-sibling::div[1]";
        this.saveButton = "//button[text()='Save']";
        this.setupIntegrationPopup = "//div[@role='alertdialog']";
    }

    async setupAppIntegration(){
        await waitForPageLoad(this.page);
        if(await this.page.locator(this.setupIntegrationPopup).isVisible()){
            await clickButton(this.page, this.saveButton);
        }else{
            await clickButton(this.page, this.setupIntegrationButton);
            await clickButton(this.page, this.saveButton);
        }
    }
}

module.exports = AppPage;