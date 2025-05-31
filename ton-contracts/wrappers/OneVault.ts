import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type OneVaultConfig = {
    id: number;
    counter: number;
};

export function oneVaultConfigToCell(config: OneVaultConfig): Cell {
    return beginCell().storeUint(0, 64).storeAddress(Address.parseFriendly("UQACELBSnsN24mT_LzaBZQUp78I6Bt9qdVt2R57Crh8TSr8j").address).endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class OneVault implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new OneVault(address);
    }

    static createFromConfig(config: OneVaultConfig, code: Cell, workchain = 0) {
        const data = oneVaultConfigToCell(config);
        const init = { code, data };
        return new OneVault(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
