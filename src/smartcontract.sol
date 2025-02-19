// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DragonIdentity {
    struct Dragon {
        string name;
        string surname;
        uint256 age;
        string color;
        address owner;
    }

    mapping(uint256 => Dragon) public dragons;
    uint256 public dragonCount;

    event DragonCreated(uint256 id, string name, string surname, uint256 age, string color, address owner);

    function createDragon(string memory _name, string memory _surname, uint256 _age, string memory _color) public {
        dragons[dragonCount] = Dragon(_name, _surname, _age, _color, msg.sender);
        emit DragonCreated(dragonCount, _name, _surname, _age, _color, msg.sender);
        dragonCount++;
    }

    function getDragon(uint256 _id) public view returns (string memory, string memory, uint256, string memory, address) {
        Dragon memory d = dragons[_id];
        return (d.name, d.surname, d.age, d.color, d.owner);
    }
}
