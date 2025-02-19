// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DragonIdentity {
    struct Dragon {
        uint256 id;
        string name;
        string surname;
        uint256 age;
        string color;
    }
    
    Dragon[] public dragons;
    mapping(uint256 => address) public dragonToOwner;
    uint256 public nextId;
    
    event DragonCreated(uint256 indexed dragonId);
    
    function createDragon(string memory _name, string memory _surname, uint256 _age, string memory _color) external {
        dragons.push(Dragon(nextId, _name, _surname, _age, _color));
        dragonToOwner[nextId] = msg.sender;
        emit DragonCreated(nextId);
        nextId++;
    }
    
    function getDragons() external view returns (Dragon[] memory) {
        return dragons;
    }
}
