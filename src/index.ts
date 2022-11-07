import { count } from 'console'
import fetch from 'cross-fetch'
import { KeyObjectType } from 'crypto'
import taxRates from './data/taxRate.json'

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */
export async function returnSiteTitles() {
  const urls = [
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.starwars.com/',
    'https://www.neowin.net/'
  ]

  const titles: string[] = []

  await Promise.allSettled(urls.map(fetchSite)).then(responses => {
    for (let index = 0; index < responses.length; index++) {
      const element = responses[index]

      if (element.status == 'fulfilled') {
        const match = element.value.match(/<title>(.*?)<\/title>/)
        if (match?.length) {
          titles.push(match[1])
        }
      }
    }
  })

  return titles
}

async function fetchSite(url: string) {
  const res = await fetch(url) // "GET" is the default method
  if (!res.ok) {
    throw new Error('Could not connect')
  }

  return res.text()
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tagCounts: Array<TagCounts> = []
  // this object is to keep track of the count
  const tagDic: Record<string, number> = {}
  // this object is to keep the index of the object which is saved
  const indexDic: Record<string, number> = {}

  for (let i = 0; i < localData.length; i++) {
    const tags = localData[i].tags

    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j]

      if (tag in tagDic) {
        tagDic[tag] += 1
        tagCounts[indexDic[tag]] = { tag, count: tagDic[tag] }
      } else {
        tagDic[tag] = 1
        indexDic[tag] = tagCounts.length
        tagCounts.push({ tag, count: 1 })
      }
    }
  }
  return tagCounts
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 */
export function calcualteImportCost(importedItems: Array<ImportedItem>): Array<ImportCostOutput> {
  // please write your code in here.

  const importCosts = importedItems.map(importedItem => {
    const importTaxRate = calculateImportTaxRate(importedItem.countryDestination, importedItem.category)
    const importCost = importedItem.unitPrice * importedItem.quantity * importTaxRate
    const subtotal = importedItem.unitPrice * importedItem.quantity
    const totalCost = importCost + subtotal
    return { name: importedItem.name, totalCost, importCost, subtotal }
  })

  return importCosts
  // note that `taxRate` has already been imported for you
}

function calculateImportTaxRate(destinationCountry: string, category: string): number {
  const country = taxRates.find(item => item.country === destinationCountry)

  // if undefined throw an error
  if (country === undefined) {
    throw new Error('Country not found')
  }
  // if there zero
  if (country.categoryExceptions.includes(category)) {
    return 0
  }

  return country.importTaxRate
}
