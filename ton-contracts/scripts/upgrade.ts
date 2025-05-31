import { toNano, Cell } from '@ton/core';
import { OneVault } from '../wrappers/OneVault';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
let cell = Cell.fromBoc(Buffer.from("b5ee9c7241020d01000108000114ff00f4a413f4bcf2c80b01020162020a0202cd030501efd361110638048adf000e8698180b8d848adf07d2018780280e98fe99f81410839b1684e5d472180fd007d20690000c9eba6686f7d206a187c2092507c30b8410807c53f52e4658f8b659fa8027d0100e78b00e78b29087a00410805f5e1007d017a0064c0207803f80370187c21096382f973336a187d824040028821005f5e10070fb02f84270c8c98306f007f0060201200607001d5ed44d0d33f01f861fa4001f862d18020120080900193e107232cffe10b3c5b27b552000311c20043232c1540173c59400fe8084f2da44bd0032407ec0200201580b0c0011b9e4ef005f841f84280011b8c24f005f841f84281712eb13", 'hex'))[0];
    const oneVault = provider.open(
        OneVault.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },

    cell 
    )
    );

    await oneVault.sendUpgrade(provider.sender(), toNano('0.05'), await compile('OneVault'));

}
