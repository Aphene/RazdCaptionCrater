pragma solidity ^0.8.0;

contract PaymentContract {
    
    address payable public owner;
    
    constructor() {
        owner = payable(msg.sender);
    }
    
    receive() external payable {
        emit PaymentReceivedEvent(msg.sender, msg.value);
    }
    
    event PaymentReceivedEvent(address from, uint256 amount);
    
    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw funds");
        require(address(this).balance >= amount, "Insufficient balance");
        owner.transfer(amount);
    }

    function makePayment() external payable {
        require(msg.value > 0, "Value must be greater than 0");
        emit PaymentReceivedEvent(msg.sender, msg.value);
    }
}
