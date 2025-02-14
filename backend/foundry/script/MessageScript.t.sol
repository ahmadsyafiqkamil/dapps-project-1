    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Message.sol";

contract MessageScript is Script {
    function run() external {
        vm.startBroadcast();

        new Message();    

        vm.stopBroadcast();
    }
}
