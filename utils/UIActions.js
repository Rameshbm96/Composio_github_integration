    async function clickButton(page, locator) {
        try {
            await page.waitForSelector(locator, { state: 'visible' });
            await page.click(locator);
        } catch (error) {
            console.error(`Failed to click on the element with locator: ${locator}`, error);
            throw error;
        }
    }

    async function fillTextField(page, locator, text) {
        try {
            await page.waitForSelector(locator, { state: 'visible' });
            await page.fill(locator, text);
        } catch (error) {
            console.error(`Failed to fill the text field with locator: ${locator}`, error);
            throw error;
        }
    }

    async function waitForPageLoad(page) {
        try {
            await page.waitForLoadState('load');
        } catch (error) {
            console.error('Failed to wait for the page to load.', error);
            throw error;
        }
    }

    async function handleDialogAlert(page, my_input) {
        await page.on('dialog', async dialog => {
            if (dialog.type() === 'prompt') {
            await dialog.accept(my_input); 
            } else {
            await dialog.accept();
            }
        })
    }

module.exports = { waitForPageLoad, fillTextField, clickButton, handleDialogAlert }