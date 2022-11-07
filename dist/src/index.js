import fetch from 'cross-fetch';
import taxRates from './data/taxRate.json';
export async function returnSiteTitles() {
    const urls = [
        'https://patientstudio.com/',
        'https://www.startrek.com/',
        'https://www.starwars.com/',
        'https://www.neowin.net/'
    ];
    const titles = [];
    await Promise.allSettled(urls.map(fetchSite)).then(responses => {
        for (let index = 0; index < responses.length; index++) {
            const element = responses[index];
            if (element.status == 'fulfilled') {
                const match = element.value.match(/<title>(.*?)<\/title>/);
                if (match === null || match === void 0 ? void 0 : match.length) {
                    titles.push(match[1]);
                }
            }
        }
    });
    return titles;
}
async function fetchSite(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Could not connect');
    }
    return res.text();
}
export function findTagCounts(localData) {
    const tagCounts = [];
    const tagDic = {};
    const indexDic = {};
    for (let i = 0; i < localData.length; i++) {
        const tags = localData[i].tags;
        for (let j = 0; j < tags.length; j++) {
            const tag = tags[j];
            if (tag in tagDic) {
                tagDic[tag] += 1;
                tagCounts[indexDic[tag]] = { tag, count: tagDic[tag] };
            }
            else {
                tagDic[tag] = 1;
                indexDic[tag] = tagCounts.length;
                tagCounts.push({ tag, count: 1 });
            }
        }
    }
    return tagCounts;
}
export function calcualteImportCost(importedItems) {
    const importCosts = importedItems.map(importedItem => {
        const importTaxRate = calculateImportTaxRate(importedItem.countryDestination, importedItem.category);
        const importCost = importedItem.unitPrice * importedItem.quantity * importTaxRate;
        const subtotal = importedItem.unitPrice * importedItem.quantity;
        const totalCost = importCost + subtotal;
        return { name: importedItem.name, totalCost, importCost, subtotal };
    });
    return importCosts;
}
function calculateImportTaxRate(destinationCountry, category) {
    const country = taxRates.find(item => item.country === destinationCountry);
    if (country === undefined) {
        throw new Error('Country not found');
    }
    if (country.categoryExceptions.includes(category)) {
        return 0;
    }
    return country.importTaxRate;
}
