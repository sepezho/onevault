import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { OneVault } from '../wrappers/OneVault';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('OneVault', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('OneVault');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let oneVault: SandboxContract<OneVault>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        oneVault = blockchain.openContract(
            OneVault.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await oneVault.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: oneVault.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and oneVault are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await oneVault.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await oneVault.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: oneVault.address,
                success: true,
            });

            const counterAfter = await oneVault.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
