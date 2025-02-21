// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DragonIdentity {
    struct Dragon {
        uint256 id;
        string name;
        string surname;
        uint256 age;
        string color;
        address owner;
    }

    mapping(address => uint256) public ownerToDragon;
    mapping(uint256 => Dragon) public dragons;
    uint256 public nextDragonId;

    event DragonCreated(uint256 dragonId, address owner);

    function createDragon(string memory _name, string memory _surname, uint256 _age, string memory _color) public {
        require(ownerToDragon[msg.sender] == 0, "You already own a dragon");

        nextDragonId++;
        dragons[nextDragonId] = Dragon(nextDragonId, _name, _surname, _age, _color, msg.sender);
        ownerToDragon[msg.sender] = nextDragonId;

        emit DragonCreated(nextDragonId, msg.sender);
    }

    function getMyDragon() public view returns (Dragon memory) {
        uint256 dragonId = ownerToDragon[msg.sender];
        require(dragonId != 0, "No dragon found for this address");
        return dragons[dragonId];
    }

    function getAllDragons() public view returns (Dragon[] memory) {
        Dragon[] memory allDragons = new Dragon[](nextDragonId);
        for (uint256 i = 1; i <= nextDragonId; i++) {
            allDragons[i - 1] = dragons[i];
        }
        return allDragons;
    }
}
