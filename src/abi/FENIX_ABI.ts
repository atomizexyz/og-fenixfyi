const FENIX_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "UD60x18",
        name: "x",
        type: "uint256",
      },
    ],
    name: "PRBMathUD60x18__Exp2InputTooBig",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "UD60x18",
        name: "x",
        type: "uint256",
      },
    ],
    name: "PRBMathUD60x18__LogInputTooSmall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "PRBMathUD60x18__ToUD60x18Overflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
    ],
    name: "PRBMath__MulDiv18Overflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
    ],
    name: "PRBMath__MulDivOverflow",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "xenContract",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "xenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "Redeemed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bigBonusUnclaimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "xen",
        type: "uint256",
      },
    ],
    name: "burnXEN",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fenix",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
    ],
    name: "calculateBonus",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deferralTs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakeId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "term",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fenix",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bonus",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "payout",
            type: "uint256",
          },
        ],
        internalType: "struct Stake",
        name: "stake",
        type: "tuple",
      },
    ],
    name: "calculateEarlyPenalty",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deferralTs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakeId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "term",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fenix",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bonus",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "payout",
            type: "uint256",
          },
        ],
        internalType: "struct Stake",
        name: "stake",
        type: "tuple",
      },
    ],
    name: "calculateLatePenalty",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fenix",
        type: "uint256",
      },
    ],
    name: "calculateSizeBonus",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fenix",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
    ],
    name: "calculateTimeBonus",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "claimBigBonus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentStakeId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stakeIndex",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
    ],
    name: "deferStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stakeIndex",
        type: "uint256",
      },
    ],
    name: "endStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxInflationEndTs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "onTokenBurned",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "poolSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolTotalShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolTotalStakes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "shareRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
    ],
    name: "stakeCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakerAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "stakeIndex",
        type: "uint256",
      },
    ],
    name: "stakeFor",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deferralTs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakeId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "term",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fenix",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bonus",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "payout",
            type: "uint256",
          },
        ],
        internalType: "struct Stake",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakes",
    outputs: [
      {
        internalType: "uint256",
        name: "startTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deferralTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakeId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fenix",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bonus",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fenix",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "term",
        type: "uint256",
      },
    ],
    name: "startStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default FENIX_ABI;
