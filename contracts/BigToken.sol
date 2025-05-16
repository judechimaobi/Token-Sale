// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BigToken {
  // Add a Constructor
  // Set the number of tokens
  // Read the total number of tokens
  // Initialize name, symbol & Standard
  // Add a transfer function + event
  // Delegated Transfer

  string public name = "Big Token";
  string public symbol = "BIG";
  string public standard = "BigToken v1.0";
  uint256 public totalSupply;

  event Transfer (
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  // Approve
  event Approval (
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;
  // Allowance
  mapping(address => mapping(address => uint256)) public allowance;

  constructor (uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  // Transfer
  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }


  // Delegated Transfer
    // approve
    function approve(address _spender, uint _value) public returns (bool success) {
      allowance[msg.sender][_spender] = _value;
      emit Approval(msg.sender, _spender, _value);
      return true;
    }

    
    // TransferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
      // Require from account has enough token
      require(_value <= balanceOf[_from]);
      // Require the allowance is big enough
      require(_value <= allowance[_from][msg.sender]);
      // Change balance
      balanceOf[_from] -= _value;
      balanceOf[_to] += _value;
      // Update allowance
      allowance[_from][msg.sender] -= _value;
      // Transfer Event
      emit Transfer(_from, _to, _value);
      // Return a boolean
      return true;
    }
}
