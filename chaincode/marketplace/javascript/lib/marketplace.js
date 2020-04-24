'use strict';

const { Contract } = require('fabric-contract-api');

class MarketPlace extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const items = [
            {
                type: 'tomatos',
                address: 'Farm 55 Mill St, Toronto, ON M5A 3C4',
                unicID: '0x01F9338f2c7Db2724fBe0449264C3E9E286eb7F2',
                owner: 'Wilmar',
            },
            {
                type: 'milk',
                address: '200 King St E, Toronto, ON M5A 3W8',
                unicID: '0x78096945117060aB43cf6F25a8019d4d78151CA4',
                owner: 'Mathai',
            },
            {
                type: 'eggs',
                address: '1 Austin Terrace, Toronto, ON M5R 1X8',
                unicID: '0x22924cAc963445008cFD66C67D541e8214167bca',
                owner: 'Eduardo',
            },
            {
                type: 'cheese',
                address: '160 Kendal Ave, Toronto, ON M5R 1M3',
                unicID: '0xffA84b4458f72f3f4D3b40b172A9cDc811F53C44',
                owner: 'Edwerton',
            },
            {
                type: 'pork',
                address: '51 Dockside Dr, Toronto, ON M5A 0B6',
                unicID: '0xaAE3A71205B221cC96A8B6d093d6736325c3bd2C',
                owner: 'Dave',
            },
            {
                type: 'flowers',
                address: '200 King St E, Toronto, ON M5A 3W8',
                unicID: '0x6AbD91250EcCb5f5d2Ae64e9ef6DF11F4efcf25f',
                owner: 'Tarum',
            },
            {
                type: 'potatoes',
                address: '0H7461 Cherry St, Toronto, ON M5A',
                unicID: '0xcCD5BA1e170d171e2B43c4C9de796bD3825cD998',
                owner: 'Dishan',
            },
            {
                type: 'pizza',
                address: '200 King St E, Toronto, ON M5A 3W8',
                unicID: '0x04BA20F9B0aE16b6B1639F03C7288398865061C4',
                owner: 'Jamshed',
            },
            {
                type: 'iberic',
                address: '111 Richmond St W #12, Toronto, ON M5H 2G4',
                unicID: '0xA45E1Ee64177aECD79698877c5cA67769343e0F8',
                owner: 'Erick',
            },
        ];

        for (let i = 0; i < items.length; i++) {
            items[i].docType = 'item';
            await ctx.stub.putState('ITEM' + i, Buffer.from(JSON.stringify(items[i])));
            console.info('Added <--> ', items[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryItem(ctx, itemNumber) {
        const itemAsBytes = await ctx.stub.getState(itemNumber); // get the item from chaincode state
        if (!itemAsBytes || itemAsBytes.length === 0) {
            throw new Error(`${itemNumber} does not exist`);
        }
        console.log(itemAsBytes.toString());
        return itemAsBytes.toString();
    }

    async createItem(ctx, itemNumber, address, unicID, type, owner) {
        console.info('============= START : Create Item ===========');

        const item = {
            type,
            docType: 'item',
            address,
            unicID,
            owner,
        };

        await ctx.stub.putState(itemNumber, Buffer.from(JSON.stringify(item)));
        console.info('============= END : Create Item ===========');
    }

    async queryAllItems(ctx) {
        const startKey = 'ITEM0';
        const endKey = 'ITEM999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeItemOwner(ctx, itemNumber, newOwner) {
        console.info('============= START : changeItemOwner ===========');

        const itemAsBytes = await ctx.stub.getState(itemNumber); // get the item from chaincode state
        if (!itemAsBytes || itemAsBytes.length === 0) {
            throw new Error(`${itemNumber} does not exist`);
        }
        const item = JSON.parse(itemAsBytes.toString());
        item.owner = newOwner;

        await ctx.stub.putState(itemNumber, Buffer.from(JSON.stringify(item)));
        console.info('============= END : changeItemOwner ===========');
    }

}

module.exports = MarketPlace;
