import { toNano } from '@ton/core';
import { OneVault } from '../wrappers/OneVault';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const oneVault = provider.open(
        OneVault.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('OneVault')
        )
    );

    await oneVault.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(oneVault.address);

    console.log('ID', await oneVault.getID());
}
