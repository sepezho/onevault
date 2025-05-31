
try {
let body = Cell.fromBoc(Buffer.from("b5ee9c724101020100860002ff0000004f465453656e64515ee05fb727edcbfb737ee4ffc93ff7fffffffffffffffffffffffffffffffffffc0001d654000000000000000000000003db4a565497134073dcf74fd9192029dd0c347c9c00000000000000000000000000000000000000000000000000000000ee6b280000000000000000000000000000000002010100005763de6b", 'hex'))[0];//oft body
      const trx = wallet.createTransfer({
        secretKey: keys.secretKey,
        seqno: await wallet.getSeqNo(),
        sendMode: SendMode.CARRRY_ALL_REMAINING_INCOMING_VALUE,
        order: new InternalMessage({
          to: Address.parseFriendly("EQAJKYaW0xffKjcbynIIegq5xeeq4dKTe3-pJNm2mjrsDeW1").address, //jw 
          value: toNano(2.2),
          bounce: false,
    //      body: new CommonMessageInfo({
    //        body: new CellMessage(body),
    //      })
    body: new CommonMessageInfo({
      body: new CellMessage(
          beginCell()
            .storeUint(0x0f8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(0.1 * 1e6) 
            .storeAddress(Address.parseFriendly("EQDk5pz6PmMxrF5U-iU_d89o0TsdGjcKySb3TL5c-wzRXYkk").address)//vault
            .storeAddress(Address.parseFriendly("UQACELBSnsN24mT_LzaBZQUp78I6Bt9qdVt2R57Crh8TSr8j").address)//myaddr
            .storeBit(0)
            .storeCoins(toNano(2.1))
            .storeBit(1)
            .storeRef(
              beginCell()
                .storeAddress(Address.parseFriendly("EQAXByU5SqVhNvvSfQzjHYqY4PiucqTSN5td3oPiEaLV-p0-").address)//oft usdt0 addr
                .storeRef(body)
              .endCell()
            )
            .endCell())
    }),
        })
      })
      console.log(JSON.stringify(await rpcClient.sendExternalMessage(wallet, trx)))
      console.log('- done trx!')
    } catch (e) {
      console.log('a',e)
    }
