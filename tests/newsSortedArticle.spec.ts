import{test ,expect} from '@playwright/test'

test('Verify first 100 Hacker News articles are sorted newest to oldest', async({page})=>{

await page.goto('https://news.ycombinator.com/newest');
const articles = page.locator("//tr[@class='athing submission']");
const articleCount = await articles.count();
const articleTimeStamp = page.locator("//tr[@class='athing submission']/following-sibling::tr[1]//span[@class ='age']");
const timeStamp = [];
const nextPage = page.locator("//a[@class = 'morelink']");

while(timeStamp.length < 100){
    for(let i=0; i<articleCount ; i++){
        if(timeStamp.length===100){
            break;
        }

const articletimeattribute = await articleTimeStamp.nth(i).getAttribute('title'); 
const timeStamps = Date.parse(articletimeattribute!);
timeStamp.push(timeStamps);

}

if(timeStamp.length < 100){
    await page.waitForTimeout(2000);
    await nextPage.click();
}
}

expect(timeStamp.length).toBe(100);
for(let i= 0 ; i<timeStamp.length-1 ; i++ ){

    const currentArticle = timeStamp[i];
    const nextArticle = timeStamp[i + 1];

        // To verify that the articles are sorted from newest to oldest,
        expect(nextArticle, `Article at position ${i + 2} is newer than article at position ${i + 1}`).toBeLessThanOrEqual(currentArticle);
    }
console.log("sorted");

})