const { clickButton, waitForPageLoad } = require('../utils/UIActions')
class ConnectedAccountsPage{
    constructor(page){
        this.page = page;
        this.connectedAccountsOption = "(//span[text()='Connected accounts'])[1]";
        this.accountOpenButton = "(//button[@role='switch']/following-sibling::button)[1]";
        this.connectionStatusInfoPopup = "//div[@role='alertdialog']";
        this.statusInfoPopupCloseIcon = "svg[class='lucide lucide-xcircle ']";
    }
    
    async selectConnectedAccountsOpton() {
        await waitForPageLoad(this.page);
        if(this.connectionStatusInfoPopup){
            await clickButton(this.page, this.statusInfoPopupCloseIcon);
        }
        await clickButton(this.page, this.connectedAccountsOption);
    }

    async selectAccountOpenButton(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.accountOpenButton);
    }
}

module.exports = ConnectedAccountsPage;