// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/* ───────────── External Interfaces ───────────── */

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
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

/* ───────────── One-purpose vault ───────────── */

contract LZ_OFT_AaveVault is ILayerZeroReceiver {
    /* ----  hard-wired main-net config  ---- */
    address public constant ADMIN       = 0xF6D2959525c4D01cf73Dd3f646480a77430D1F27;
    IERC20  public constant USDT        = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    address public constant LZ_ENDPOINT = 0x1a44076050125825900e736c501f859c50fE728c;
    IPool   public constant AAVE_POOL   = IPool(0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2);

    /* ----  events  ---- */
    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == ADMIN, "not admin");
        _;
    }

    constructor() {
        // однократный бесконечный аппрув для пула
        USDT.approve(address(AAVE_POOL), type(uint256).max);
    }

    /* ───────────────── LayerZero hook ───────────────── */

    /// OFT-transfer → USDT зачислен → endpoint вызывает lzReceive (payload пустой)
    function lzReceive(
        uint16, bytes calldata, uint64, bytes calldata
    ) external override {
        require(msg.sender == LZ_ENDPOINT, "bad endpoint");

        uint256 amt = USDT.balanceOf(address(this));
        require(amt > 0, "no funds");

        AAVE_POOL.supply(address(USDT), amt, address(this), 0);
        emit Deposited(amt);
    }

    /* ───────────────── Admin ───────────────── */

    /// Админ забирает всю позицию (депозит + доход) к себе на EOA
    function withdrawAll() external onlyAdmin {
        uint256 amt = AAVE_POOL.withdraw(address(USDT), type(uint256).max, ADMIN);
        emit Withdrawn(amt);
    }
}
