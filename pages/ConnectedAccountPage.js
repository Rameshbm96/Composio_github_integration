const { clickButton, waitForPageLoad } = require('../utils/UIActions');

class ConnectedAccountPage {
    constructor(page){
        this.page = page;
        this.actionsButton = "//button[text()='actions']";
        this.gitHubRootApiButton = "//div[@title='Github api root']/following-sibling::div[3]/button";
        this.runActionButton = "//button[text()='Run action']";
        this.runActionPopupCloseIcon = "svg[class='lucide lucide-xcircle ']";
        this.userIcon = "(//button[@type='button'])[2]";
        this.userLogoutOption = "//div[@role='menuitem' and text()='Logout']";
    }

    async selectActionsOption(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.actionsButton);
    }

    async selectAppAPItoExecute(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.gitHubRootApiButton);
    }

    async runSelectedAction(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.runActionButton);
        await clickButton(this.page, this.runActionPopupCloseIcon);
    }

    async selectUserIcon(){
        await clickButton(this.page, this.userIcon);
    }

    async selectUserLogout(){
        await clickButton(this.page, this.userLogoutOption);
    }

}

module.exports = ConnectedAccountPage;