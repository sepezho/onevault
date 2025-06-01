// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

interface ILayerZeroReceiver {
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) external;
}

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IPool {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
}


contract LZ_OFT_AaveVault is ILayerZeroReceiver {
    address public constant ADMIN       = 0xF6D2959525c4D01cf73Dd3f646480a77430D1F27;
    IERC20  public constant USDT        = IERC20(0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9);
    address public constant LZ_ENDPOINT = 0x1a44076050125825900e736c501f859c50fE728c;
    IPool   public constant AAVE_POOL   = IPool(0x794a61358D6845594F94dc1DB02A252b5b4814aD);

    /* ---- events ---- */
    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == ADMIN, "not admin");
        _;
    }

    constructor() {
        try USDT.approve(address(AAVE_POOL), type(uint256).max) {
        } catch {
        }
    }

    /// todo change oft send to oft send and execute on LZ , so we will be able to recv this message here 
    function lzReceive(
        uint16,           /* _srcChainId  */
        bytes calldata,   /* _srcAddress  */
        uint64,           /* _nonce       */
        bytes calldata    /* _payload     */
    ) external override {
        require(msg.sender == LZ_ENDPOINT, "bad endpoint");

        uint256 amt = USDT.balanceOf(address(this));
        require(amt > 0, "no funds");

        AAVE_POOL.supply(address(USDT), amt, address(this), 0);
        emit Deposited(amt);
    }

    function withdrawAll() external onlyAdmin {
        uint256 amt = AAVE_POOL.withdraw(address(USDT), type(uint256).max, ADMIN);
        emit Withdrawn(amt);
    }
}

