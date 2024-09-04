const { clickButton, fillTextField, waitForPageLoad } = require('../utils/UIActions')
class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailTextField = "//input[@type='email']";
        this.sendLogInLinkButton = "(//button[@title='Get Magic Link'])[2]";
    }

    async enterUserMailAddress(mailId){
        await waitForPageLoad(this.page);
        await fillTextField(this.page, this.emailTextField, mailId);
    }

    async clickSendLogInLinkButton(){
        await waitForPageLoad(this.page);
        await clickButton(this.page, this.sendLogInLinkButton);
    }
}

module.exports = LoginPage;