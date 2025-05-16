pragma solidity >=0.4.22 <0.9.0;

import "./BigToken.sol";

contract BigTokenSale {

	// # Provision Tokes to the token Sale contract
	// # Set a token price in wei
	// # Asign an admin
	// # Buy tokens
	// # End sale


	address payable admin;
	BigToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;


	event Sell(address _buyer, uint256 _amount);

	constructor (BigToken _tokenContract, uint256 _tokenPrice) public {
		// Assign an admin
		admin = msg.sender;
		// InitializeToken sale
		tokenContract = _tokenContract;
		// Initialize Token price
		tokenPrice = _tokenPrice;
	}

	// multipy
	function multiply (uint256 x, uint256 y) internal pure returns (uint z) {
		require (y == 0 || (z = x * y) / y == x);
	}

	function buyTokens(uint256 _numberOfTokens) public payable {
		// Require that the value is equal to tokens
		require(msg.value == multiply(_numberOfTokens, tokenPrice));

		// Require that the contract has enough tokens 
		require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

		// Require that the transfer is successful
		require(tokenContract.transfer(msg.sender, _numberOfTokens));

		// Keep track of number of tokens sold
		tokensSold += _numberOfTokens;
		
		// Emit a sell event
		emit Sell(msg.sender, _numberOfTokens);
	}


	// Ending the token sale
	function endSale() public {
		// Require that only an admin can end sale
		require(msg.sender == admin);
		// Transfer the remaining BigTokens to the Admin
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		// UPDATE: Let's not destroy the contract here
    	// Just transfer the balance to the admin
		admin.transfer(address(this).balance);
	}

}