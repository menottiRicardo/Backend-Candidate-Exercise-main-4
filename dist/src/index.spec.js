import * as testFunctions from './index';
import importedItems from './data/importedItems.json';
describe('Test calculatePriceWithTaxes', () => {
    it('should return results in the correct format', () => {
        const results = testFunctions.calcualteImportCost(importedItems);
        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({
                subtotal: expect.any(Number),
                importCost: expect.any(Number),
                totalCost: expect.any(Number),
                name: expect.any(String)
            })
        ]));
    });
    it('should calculate the correct import cost for each item', () => {
        const results = testFunctions.calcualteImportCost(importedItems);
        const coffee = results.find(r => r.name === 'Coffee');
        const bigAvocados = results.find(r => r.name === 'Big Avocados');
        const biggerAvocados = results.find(r => r.name === 'Bigger Avocados');
        const tesla = results.find(r => r.name === 'Tesla Roadster');
        const schnitzel = results.find(r => r.name === 'Jägerschnitzel');
        expect(coffee === null || coffee === void 0 ? void 0 : coffee.importCost).toBe(3720);
        expect(coffee === null || coffee === void 0 ? void 0 : coffee.totalCost).toBe(34720);
        expect(bigAvocados === null || bigAvocados === void 0 ? void 0 : bigAvocados.importCost).toBe(0);
        expect(bigAvocados === null || bigAvocados === void 0 ? void 0 : bigAvocados.totalCost).toBe(500);
        expect(biggerAvocados === null || biggerAvocados === void 0 ? void 0 : biggerAvocados.importCost).toBe(0);
        expect(biggerAvocados === null || biggerAvocados === void 0 ? void 0 : biggerAvocados.totalCost).toBe(1000);
        expect(tesla === null || tesla === void 0 ? void 0 : tesla.importCost).toBe(2880000);
        expect(tesla === null || tesla === void 0 ? void 0 : tesla.totalCost).toBe(26880000);
        expect(schnitzel === null || schnitzel === void 0 ? void 0 : schnitzel.importCost).toBe(3000);
        expect(schnitzel === null || schnitzel === void 0 ? void 0 : schnitzel.totalCost).toBe(53000);
    });
});
