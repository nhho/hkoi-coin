import { createConfig, http } from 'wagmi';
import { type Transport } from '@wagmi/core'
import { base, baseSepolia, type Chain } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit';


var chain: Chain;
const transports: Record<number, Transport> = {};
switch (process.env.NEXT_PUBLIC_CHAIN) {
  case 'base': {
    chain = base;
    transports[base.id] = http(process.env.NEXT_PUBLIC_BASE_URL);
    break;
  }
  case 'base-sepolia': {
    chain = baseSepolia;
    transports[baseSepolia.id] = http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_URL);
    break;
  }
  default: {
    throw new Error('Unsupported chain');
  }
}

export const config = createConfig(
  getDefaultConfig({
    appName: 'HKOI Coin',
    chains: [chain],
    transports: transports,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
