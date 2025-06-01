import { beginCell, Cell, toNano, Address, storeStateInit} from "ton";
import { useTonConnectUI ,useTonAddress } from '@tonconnect/ui-react';
import { USDT_MAINNET} from "@evaafi/sdk";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


function getUserJettonData(ownerAddress: Address, assetName: string, jettonWalletCode: Cell, jettonMasterAddress: Address) {
  switch (assetName) {
      case 'uTON':
          return beginCell()
              .storeCoins(0)
              .storeUint(0, 64)
              .storeAddress(ownerAddress)
              .storeAddress(jettonMasterAddress)
              .storeRef(jettonWalletCode)
              .endCell();
      case 'DOGS':
      case 'NOT':
      case 'USDT':
      case 'USDe':
          return beginCell()
              .storeUint(0, 4)
              .storeCoins(0)
              .storeAddress(ownerAddress)
              .storeAddress(jettonMasterAddress)
              .endCell();
      case 'tsUSDe':
        return beginCell()
          .storeUint(0, 4)
          .storeCoins(0)
          .storeAddress(ownerAddress)
          .storeAddress(jettonMasterAddress)
          .storeCoins(0)
          .storeUint(0, 64)
          .endCell();
      case 'tsTON':
          return beginCell()
              .storeCoins(0)
              .storeAddress(ownerAddress)
              .storeAddress(jettonMasterAddress)
              .storeRef(jettonWalletCode)
              .storeCoins(0)
              .storeUint(0, 48)
              .endCell();
      case 'tgBTC':
          return beginCell()
              .storeUint(0, 4)
              .storeCoins(0)
              .storeAddress(ownerAddress)
              .storeAddress(jettonMasterAddress)
              .endCell();
      default:
          return beginCell().storeCoins(0)
              .storeAddress(ownerAddress)
              .storeAddress(jettonMasterAddress)
              .storeRef(jettonWalletCode)
              .endCell();
  }
}

export function getUserJettonWallet(ownerAddress: Address, poolAssetConfig: any) {
  const assetName = poolAssetConfig.name;
  let jettonWalletCode = poolAssetConfig.jettonWalletCode;

  if (assetName === 'USDT' || assetName === 'tsTON') {
    const lib_prep = beginCell().storeUint(2, 8).storeBuffer(jettonWalletCode.hash()).endCell();
    jettonWalletCode = new Cell({ exotic: true, bits: lib_prep.bits, refs: lib_prep.refs });
  }

  const jettonData = getUserJettonData(ownerAddress, assetName, jettonWalletCode, poolAssetConfig.jettonMasterAddress);

  const stateInit = beginCell()
    .store(
      storeStateInit({
        code: jettonWalletCode,
        data: jettonData
      })
    )
    .endCell();

  return new Address(0, stateInit.hash());
}

const Cells = () => {
  const userFriendlyAddress = useTonAddress();

  const [tonConnectUI] = useTonConnectUI();

  const submitTx = async () => {
let body = Cell.fromBoc(Buffer.from("b5ee9c724101020100860002ff0000004f465453656e64515ee05fb727edcbfb737ee4ffc93ff7fffffffffffffffffffffffffffffffffffc0001d678000000000000000000000000215ceda29e8b4012deb09aaa96ec247a7715215800000000000000000000000000000000000000000000000000000000ee6b280000000000000000000000000000000002010100003c7909bc", 'hex'))[0];
    console.log(userFriendlyAddress)
     const jwaddr = getUserJettonWallet(Address.parseFriendly(userFriendlyAddress).address, {...USDT_MAINNET, jettonMasterAddress: Address.parse(USDT_MAINNET.jettonMasterAddress.toString())});
    console.log("jwaddr", jwaddr.toString());
    const bodya =
          beginCell()
            .storeUint(0x0f8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(0.1 * 1e6) 
            .storeAddress(Address.parseFriendly("EQDk5pz6PmMxrF5U-iU_d89o0TsdGjcKySb3TL5c-wzRXYkk").address)
            .storeAddress(Address.parseFriendly(userFriendlyAddress).address)
            .storeBit(0)
            .storeCoins(toNano(2.1))
            .storeBit(1)
            .storeRef(
              beginCell()
                .storeAddress(Address.parseFriendly("EQAXByU5SqVhNvvSfQzjHYqY4PiucqTSN5td3oPiEaLV-p0-").address)
                .storeRef(body)
              .endCell()
            )
            .endCell()

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 60 * 60, // 1h 
      messages: [
        {
          address: jwaddr.toString(),
          amount: "2200000000", // 2.2ton / rest (after nft fees) will be returned
          payload: bodya.toBoc().toString('base64')
        }]
    }
    try {
      tonConnectUI.sendTransaction(tx, {
        modals: 'all',
        skipRedirectToWallet: 'ios',
        notifications: [],
        returnStrategy: 'https://app.toncells.org/'
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="logic">
      <br />
      onevault
      <br />
      supply to evm protocols from telegram & ton via layer zero 
      <br />
      <br />
      <button className='update' onClick={submitTx}>supply 0.1usdt to aave</button>
      <br />
      <br />
      note: you will send 2.2ton for gas and other fees, part of it will be returned to you
      <br />
      <br />
      created by <a href={"https://sepezho.com"}>sepezho</a>
    </div >
  )
}

export default Cells;
