const {chromium, test} = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');
const AppsPage = require('../pages/AppsPage');
const AppPage = require('../pages/AppPage');
const AppConnectionPage = require('../pages/AppConnectionPage');
const ConnectedAccountsPage = require('../pages/ConnectedAccountsPage');
const ConnectedAccountPage = require('../pages/ConnectedAccountPage');
const { authorize, getSignInLink } = require('../utils/googleAuth');
const gitHubAuthentication = require('../utils/githubAuth');
const exp = require('constants');

require('dotenv').config();

test('gitHub connection with composio', async () => {
    const isHeadless = process.env.HEADLESS === 'true';
    const browser = await chromium.launch({ headless: isHeadless });
    const context = await browser.newContext();
    const page = await context.newPage();
  
    // Log-in  Page actions
    const APP_URL="https://app.composio.dev";
    await page.goto(APP_URL);
    console.log(`Opened ${APP_URL} on browser`);
    const loginPage = new LoginPage(page);
    await loginPage.enterUserMailAddress(process.env.USER_EMAIL);
    console.log(`Entered the email address`);
    await loginPage.clickSendLogInLinkButton();
    console.log(`Clicked the send-Login-Link button`);

    // Google-auth actions for Gmail to get Sign-in link from gmail-message
    await page.waitForLoadState('load');
    const client = await authorize();
    const signInLink = await getSignInLink(client);

    // Login using sign-in link
    await page.goto(signInLink);
    console.log(`Success-fully logged-in to composio application`);

    // Home Page actions
    const homePage = new HomePage(page);
    console.log(`Navigating to Tools catelogue Page`);
    await homePage.selectToolsCatelogue();
    console.log(`Clicked on Tools catelogue option from side-menu`);

    // Tools-catelogue Page actions
    const appsPage = new AppsPage(page);
    console.log(`Searching for GitHub application and choosing the application`);
    await appsPage.searchAppByName('Github');
    console.log(`Entered the Application name in Search text field`);
    await appsPage.selectApp();
    console.log(`Selected the searched application`);

    // Application Page actions
    const appPage = new AppPage(page);
    console.log(`Navigating to Selected-application Page and performing Integration`);
    await appPage.setupAppIntegration();
    console.log(`Have performed Setup-Integration action`);

    // App-connection Page actions
    const appConnectionPage = new AppConnectionPage(page);
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),  // Wait for the new tab to open
        appConnectionPage.performAppConnection()  // Perform the click that opens the new tab
    ]);

    // Perform gitHub authontication
    console.log(`Navigating to GitHub login Page`);
    await newPage.bringToFront();
    console.log(`Initiated GitHub authentication`);
    await gitHubAuthentication(newPage);
    console.log(`GitHub authentication was successfull!`);

    // Connected accounts Page actions
    const connectedAccountsPage = new ConnectedAccountsPage(page);
    console.log(`Navigating back to connected accounts page`);
    await connectedAccountsPage.selectConnectedAccountsOpton();
    console.log(`Selecting the connected account for running actions`);
    await connectedAccountsPage.selectAccountOpenButton();

    // Perform the actions for connected account
    const connectedAccountPage = new ConnectedAccountPage(page);
    console.log(`Selecting the action for execution`);
    await connectedAccountPage.selectActionsOption();
    console.log(`Clicked the Actions button`);
    await connectedAccountPage.selectAppAPItoExecute();
    console.log(`Selected Api-endpoint to make call`);
    await connectedAccountPage.runSelectedAction();
    console.log(`Executed the selected action successfully`);
    await page.close();
})
