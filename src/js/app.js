
App = {
	web3Provider: null,
	contracts: {},
	account: "0x0",
	loading: false,
	tokenPrice: 1000000000000000,
	tokensSold: 0,
	tokensAvailable: 750000,

	init: function() {
		console.log("App Initialized...");
		return App.initWeb3();
	},

	initWeb3: async function() {
		let provider;
		let ethereum = window.ethereum;

    if (ethereum) {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
        provider = window.ethereum;
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.error('No Ethereum provider detected. You should consider installing MetaMask!');
      return;
    }
    // Get the connected account address
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      const accountAddress = accounts[0];
      console.log('Connected account address:', accountAddress);
      App.account = accounts[0];
    } else {
      console.error('No accounts found');
    }
    App.web3Provider = provider;


    return App.initContracts();
	},

	initContracts: function() {
	    $.getJSON("BigTokenSale.json", function(bigTokenSale) {
	      App.contracts.BigTokenSale = TruffleContract(bigTokenSale); // Use the JSON object directly
	      App.contracts.BigTokenSale.setProvider(App.web3Provider);
	      App.contracts.BigTokenSale.deployed().then(function(bigTokenSaleInstance) {
	         console.log('Big token sale address: ', bigTokenSaleInstance.address);
	      });
	     }).done(function() {
	      	$.getJSON("BigToken.json", function(bigToken) {
			      App.contracts.BigToken = TruffleContract(bigToken); // Use the JSON object directly
			      App.contracts.BigToken.setProvider(App.web3Provider);
			      App.contracts.BigToken.deployed().then(function(bigTokenInstance) {
	          	console.log('Big token address: ', bigTokenInstance.address);
			      }).catch(function(error) {
            	console.error('Error initializing contracts:', error);
        		});
			      // Render the app to the browser
			      App.listenForEvents();
        		return App.render();
			    });
			})
		},


		listenForEvents: function() {
	    App.contracts.BigTokenSale.deployed().then(function(instance) {
	    	// Subscribe to the "Sell" event
        instance.getPastEvents({}, {
            fromBlock: 0,
            toBlock: 'latest',
        }).then( function(event) {
            console.log('Event triggered:', event);
            App.render();
        }).catch(function(error) {
       	  console.log('Failed to trigger:', error);
        })
			})
	  },

//   .watch('error', function(error) {
      //       console.error('Error listening for events:', error);
      //   });
	    // }).catch(function(error) {
      //   console.error('Error getting contract instance:', error);
	    // });

		render: function() {
			if(App.loading) {
				return;
			}
			App.loading = true;

			var loader = $('#loader');
			var content = $('#content');

			loader.show();
			content.hide();

			// Load account data
			ethereum.request({ method: 'eth_accounts' }).then(function(account) {
				account = account;
				$('#accountAddress').html("Your account: " + account);
			}).catch(function(error) {
				console.error('User denied account access:', error);
			});

			function w2e(val) {
				return val * 10 ** -18;
			}

			// alert(account);
			App.contracts.BigTokenSale.deployed().then(function(instance) {
				bigTokenSaleInstance = instance;
				return bigTokenSaleInstance.tokenPrice();
			}).then(function (tokenPrice) {
				App.tokenPrice = tokenPrice;
				$('.token-price').html(w2e(App.tokenPrice));
				return bigTokenSaleInstance.tokensSold();
			}).then(function(tokensSold) {
				App.tokensSold = tokensSold.toNumber();
				// App.tokensSold = 300000;
				$('.tokens-sold').html(App.tokensSold);
				$('.tokens-available').html(App.tokensAvailable);

				// Progress bar
				var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
				$('#progress').css('width', progressPercent + '%');

				// Load Token contract
				App.contracts.BigToken.deployed().then(function(instance) {
					bigTokenInstance = instance;
					return bigTokenInstance.balanceOf(App.account);
				}).then(function(balance) {
					$('.big-balance').html(balance.toNumber());
					App.loading = false;
					loader.hide();
					content.show();
				});
			});			
		},


		buyTokens: function() {
			var loader = $('#loader');
			var content = $('#content');
			loader.show();
			content.hide();

			var numberOfTokens = $('#numberOfTokens').val();
			App.contracts.BigTokenSale.deployed().then(function(instance) {
				return instance.buyTokens(numberOfTokens, {
					from: App.account,
					value: numberOfTokens * App.tokenPrice,
					gas: 500000
				});
			}).then(function (result) {
				console.log("Tokens bought..."); 
				$('form').trigger('reset'); // Reset the number of tokens in the form 
				// Wait for sell Event
				App.listenForEvents();
				// loader.hide();
				// content.show();

			});
		}
	}

$(function() {
	$(window).load(function() {
		App.init();
	});
});










		// if (window.ethereum) {
		// 	var obj = {
	  //       status: "",
	  //       address: null,
	  //     };
	  //   try {
	  //     const addressArray = await window.ethereum.request({
	  //       method: "eth_requestAccounts",
	  //     });
	  //     obj = {
	  //       status: "Your Account address:",
	  //       address: addressArray[0],
	  //     };
	  //     App.web3Provider = web3.currentProvider;
	      
	  //   } catch (err) {
	  //     obj = {
	  //       address: "",
	  //       status: "ERROR: " + err.message,
	  //     };
	  //   }
		// }  else {
    //   console.error('No Ethereum provider detected. You should consider installing MetaMask!');
    //   return;
    // }
		// console.log(obj.status, obj.address);
		// return App.initContracts();






		// If the web3 instance is already provided by metamask.
		// if (typeof web3 !== 'undefined') {
		// 	App.web3Provider = web3.currentProvider;
		// 	web3 = new Web3(web3.currentProvider);
		// } else {
		// 	// Specify instance if no web3 instance is provided
		// 	App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		// 	web3 = new Web3(App.web3Provider);
		// }
