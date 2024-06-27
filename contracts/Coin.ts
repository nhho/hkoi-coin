import type { Hex } from 'viem';

export const Coin = {
  abi: JSON.parse(`[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "EnforcedPause",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ExpectedPause",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "addrs",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "batchMint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`),
  bytecode: '0x608060405234801561000f575f80fd5b50604051610d4a380380610d4a83398101604081905261002e916100b7565b604051806040016040528060098152602001682425a7a49021b7b4b760b91b81525060405180604001604052806004815260200163484b4f4960e01b815250816003908161007c919061017c565b506004610089828261017c565b5050600580546001600160a01b03909316610100026001600160a81b03199093169290921790915550610236565b5f602082840312156100c7575f80fd5b81516001600160a01b03811681146100dd575f80fd5b9392505050565b634e487b7160e01b5f52604160045260245ffd5b600181811c9082168061010c57607f821691505b60208210810361012a57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561017757805f5260205f20601f840160051c810160208510156101555750805b601f840160051c820191505b81811015610174575f8155600101610161565b50505b505050565b81516001600160401b03811115610195576101956100e4565b6101a9816101a384546100f8565b84610130565b6020601f8211600181146101db575f83156101c45750848201515b5f19600385901b1c1916600184901b178455610174565b5f84815260208120601f198516915b8281101561020a57878501518255602094850194600190920191016101ea565b508482101561022757868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b610b07806102435f395ff3fe608060405234801561000f575f80fd5b50600436106100e5575f3560e01c80635c975abb116100885780638456cb59116100635780638456cb591461015e57806395d89b41146101c1578063a9059cbb146101c9578063dd62ed3e146101dc575f80fd5b80635c975abb1461017b578063685731071461018657806370a0823114610199575f80fd5b806323b872dd116100c357806323b872dd1461013c578063313ce5671461014f5780633f4ba83a1461015e57806340c10f1914610168575f80fd5b806306fdde03146100e9578063095ea7b31461010757806318160ddd1461012a575b5f80fd5b6100f1610214565b6040516100fe9190610890565b60405180910390f35b61011a6101153660046108e0565b6102a4565b60405190151581526020016100fe565b6002545b6040519081526020016100fe565b61011a61014a366004610908565b6102bd565b604051601281526020016100fe565b6101666102e0565b005b6101666101763660046108e0565b610360565b60055460ff1661011a565b61016661019436600461098a565b6103e4565b61012e6101a73660046109f6565b6001600160a01b03165f9081526020819052604090205490565b6100f16104c8565b61011a6101d73660046108e0565b6104d7565b61012e6101ea366004610a16565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b60606003805461022390610a47565b80601f016020809104026020016040519081016040528092919081815260200182805461024f90610a47565b801561029a5780601f106102715761010080835404028352916020019161029a565b820191905f5260205f20905b81548152906001019060200180831161027d57829003601f168201915b5050505050905090565b5f336102b18185856104e4565b60019150505b92915050565b5f336102ca8582856104f6565b6102d5858585610576565b506001949350505050565b600554604051630935e01b60e21b81523360048201526101009091046001600160a01b0316906324d7806c90602401602060405180830381865afa15801561032a573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061034e9190610a7f565b610356575f80fd5b61035e6105d3565b565b600554604051630935e01b60e21b81523360048201526101009091046001600160a01b0316906324d7806c90602401602060405180830381865afa1580156103aa573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906103ce9190610a7f565b6103d6575f80fd5b6103e0828261062d565b5050565b600554604051630935e01b60e21b81523360048201526101009091046001600160a01b0316906324d7806c90602401602060405180830381865afa15801561042e573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906104529190610a7f565b61045a575f80fd5b82818114610466575f80fd5b5f5b818110156104c0576104b886868381811061048557610485610a9e565b905060200201602081019061049a91906109f6565b8585848181106104ac576104ac610a9e565b9050602002013561062d565b600101610468565b505050505050565b60606004805461022390610a47565b5f336102b1818585610576565b6104f18383836001610661565b505050565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f198114610570578181101561056257604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064015b60405180910390fd5b61057084848484035f610661565b50505050565b6001600160a01b03831661059f57604051634b637e8f60e11b81525f6004820152602401610559565b6001600160a01b0382166105c85760405163ec442f0560e01b81525f6004820152602401610559565b6104f1838383610733565b6105db610746565b6005805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586106103390565b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b0382166106565760405163ec442f0560e01b81525f6004820152602401610559565b6103e05f8383610733565b6001600160a01b03841661068a5760405163e602df0560e01b81525f6004820152602401610559565b6001600160a01b0383166106b357604051634a1406b160e11b81525f6004820152602401610559565b6001600160a01b038085165f908152600160209081526040808320938716835292905220829055801561057057826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161072591815260200190565b60405180910390a350505050565b61073b610746565b6104f183838361076a565b60055460ff161561035e5760405163d93c066560e01b815260040160405180910390fd5b6001600160a01b038316610794578060025f8282546107899190610ab2565b909155506108049050565b6001600160a01b0383165f90815260208190526040902054818110156107e65760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610559565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b0382166108205760028054829003905561083e565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161088391815260200190565b60405180910390a3505050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b03811681146108db575f80fd5b919050565b5f80604083850312156108f1575f80fd5b6108fa836108c5565b946020939093013593505050565b5f805f6060848603121561091a575f80fd5b610923846108c5565b9250610931602085016108c5565b929592945050506040919091013590565b5f8083601f840112610952575f80fd5b50813567ffffffffffffffff811115610969575f80fd5b6020830191508360208260051b8501011115610983575f80fd5b9250929050565b5f805f806040858703121561099d575f80fd5b843567ffffffffffffffff8111156109b3575f80fd5b6109bf87828801610942565b909550935050602085013567ffffffffffffffff8111156109de575f80fd5b6109ea87828801610942565b95989497509550505050565b5f60208284031215610a06575f80fd5b610a0f826108c5565b9392505050565b5f8060408385031215610a27575f80fd5b610a30836108c5565b9150610a3e602084016108c5565b90509250929050565b600181811c90821680610a5b57607f821691505b602082108103610a7957634e487b7160e01b5f52602260045260245ffd5b50919050565b5f60208284031215610a8f575f80fd5b81518015158114610a0f575f80fd5b634e487b7160e01b5f52603260045260245ffd5b808201808211156102b757634e487b7160e01b5f52601160045260245ffdfea26469706673582212207a668bbca843bb8bc792701adc330c41a2ce96e07c30b8dcb101a5f1848e23ae64736f6c634300081a0033' as Hex
};
