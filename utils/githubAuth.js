const otplib = require('otplib');
const { fillTextField, clickButton, waitForPageLoad } = require('./UIActions');
require('dotenv').config();

async function gitHubAuthentication(page){
    await waitForPageLoad(page);
    if(await page.title() === "Sign in to GitHub · GitHub"){
        await fillTextField(page, "#login_field", process.env.GITHUB_USERNAME);
        await fillTextField(page, "#password", process.env.GITHUB_PASSWORD);
        await clickButton(page, "//input[@value='Sign in']");
    }

    // generate OTP-for MFA
    await waitForPageLoad(page);
    try {
        const otp = otplib.authenticator.generate(process.env.GITHUB_OTP_SECRET);
        if(await page.title() === "Two-factor authentication · GitHub"){
            await fillTextField(page, "#app_totp", otp);
        }
    } catch (error) {
        console.log(`An error occured ${error}`);
    }

    // Accept to authorize for Integatrion
    await waitForPageLoad(page);
    try{
        if(await page.title() === "Authorize application"){
            await clickButton(page, "//button[text()='Authorize composio-dev']");
            await waitForPageLoad(page);
            if(await page.waitForSelector("//div[text()='Authentication successful']", { state: 'visible'})){
                console.log("Git-Hub Integration with Composio was successfull!");
                await page.close();
            }
        }
    } catch(error){
        if(await page.isClosed()){
            return;
        }else{
            console.log(`An error occured ${error}`);
        }
    }
    
}

module.exports = gitHubAuthentication;
