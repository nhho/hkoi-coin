'use client';

import { useAccount, useBalance, useDisconnect, useDeployContract, useReadContract, useWriteContract, useConfig } from 'wagmi';
import type { UseAccountReturnType } from 'wagmi';
import type { Abi, Hex, Address } from 'viem';
import { parseUnits } from 'viem';
import { ConnectKitButton } from 'connectkit';
import { Access } from '../contracts/Access';
import { Coin } from '../contracts/Coin';
import { Sponsor } from '../contracts/Sponsor';
import { Quiz } from '../contracts/Quiz';
import Link from 'next/link'
import type { FormEvent } from 'react';

function App() {
  const account = useAccount();

  return (
    <>
      <AccountSection account={account} />
      {account.status === 'connected' && (
        <>
          <ConnectedSection account={account} />
          <DeploysSection />
        </>
      )}
    </>
  );
}

type AccountProps = {
  account: UseAccountReturnType;
}

function AccountSection({ account }: AccountProps) {
  const { disconnect } = useDisconnect();
  return (
    <div>
      <h2>Account</h2>
      <ConnectKitButton />
      <div>Status: {account.status}</div>
      {account.status === 'connected' && (
        <>
          <div>Address: <AddressSection hash={account.address as Address} /></div>
          <GasSection account={account} />
          <CoinSection account={account} />
          <button type='button' onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}

function GasSection({ account }: AccountProps) {
  const { data, status } = useBalance({address: account.address});
  if (status !== 'success') return;
  return <div>Gas: {data.formatted} {data.symbol}</div>;
}

function CoinSection({ account }: AccountProps) {
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS as Address;
  const { data, status } = useBalance({address: account.address, token: coinAddress});
  if (status !== 'success') return;
  return <div>Coin: {data.formatted}</div>;
}

function ConnectedSection({ account }: AccountProps) {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as Address;
  const { data: isAdmin, status: isAdminStatus } = useReadContract({
    abi: Access.abi,
    address: accessAddress,
    functionName: 'isAdmin',
    args: [account.address!]
  });
  const { data: userData, status: userStatus } = useReadContract({
    abi: Access.abi,
    address: accessAddress,
    functionName: 'getUserDetails'
  });
  if (isAdminStatus !== 'success' || userStatus !== 'success') return;
  const [ addresses, names, teams ] = userData as Array<Array<String>>;
  const userMap = new Map();
  for (let i = 0; i < addresses.length; i++) {
    if (!userMap.has(teams[i])) {
      userMap.set(teams[i], new Map());
    }
    userMap.get(teams[i]).set(names[i], addresses[i]);
  }

  return (
    <>
      {isAdmin && <AdminSection userMap={userMap} />}
      <UsersSection userMap={userMap} />
      <SendSection />
      <QuizSection />
    </>
  );
}

type UserProps = {
  userMap: Map<string, Map<string, string>>;
}

function AdminSection({ userMap }: UserProps) {
  return (
    <>
      <AddAdminSection />
      <AddUserSection />
      <BatchAddUserSection />
      <AdminsGasSection />
      <UsersGasSection userMap={userMap} />
      <MintSection />
      <BatchMintSection />
      <ContractsSection />
      <FixQuizSection />
      <SponsorBalanceSection />
      <SponsorWithdrawSection />
      <SponsorUsersSection />
    </>
  );
}

function AddAdminSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    writeContract({
      abi: Access.abi,
      address: accessAddress,
      functionName: 'addAdmin',
      args: [data.get('address') as string]
    });
  }

  return (
    <>
      <h2>Add admin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Address: <input name='address' defaultValue='0x0123' size={50} />
        </div>
        <div>
          <button type='submit'>Add</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function AddUserSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    writeContract({
      abi: Access.abi,
      address: accessAddress,
      functionName: 'addUser',
      args: [data.get('address') as string, data.get('name') as string, data.get('team') as string]
    });
  }

  return (
    <>
      <h2>Add user</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Address: <input name='address' defaultValue='0x0123' size={50} />
        </div>
        <div>
          Name: <input name='name' defaultValue='HKOI username' />
        </div>
        <div>
          Team: <input name='team' defaultValue='Team ID' />
        </div>
        <div>
          <button type='submit'>Add</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function BatchAddUserSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const csv = data.get('csv') as string;
    const args: string[][] = [[], [], []];
    csv.split(/\r?\n/).forEach(line => {
      const entries = line.split(',');
      if (entries.length !== 3) return;
      for (let i = 0; i < 3; i++) {
        args[i].push(entries[i]);
      }
    });
    writeContract({
      abi: Access.abi,
      address: accessAddress,
      functionName: 'addUsers',
      args: args
    });
  }

  return (
    <>
      <h2>Add users</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea name='csv' defaultValue={'0x0123,name1,teamid1\n0x0456,name2,teamid2'} />
        </div>
        <div>
          <button type='submit'>Add</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function AdminsGasSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as Address;
  const { data: admins, status: adminStatus } = useReadContract({
    abi: Access.abi,
    address: accessAddress,
    functionName: 'getAdmins'
  });
  if (adminStatus !== 'success') return;

  const balances = (admins as Array<Address>).map(addr => (
    <AdminGasBalanceSection key={addr} address={addr} />
  ));
  return (
    <>
      <h2>Admins Gas</h2>
      {balances}
    </>
  );
}

type AddressProps = {
  address: string;
}

function AdminGasBalanceSection({ address }: AddressProps) {
  const { data, status } = useBalance({address: address as Address});
  if (status !== 'success') return;
  return <div><AddressSection hash={address} />: {data.formatted} {data.symbol}</div>;
}

function UsersGasSection({ userMap }: UserProps) {
  const balances = [...userMap.entries()].sort().map(entry =>
    [...entry[1].entries()].sort().map(subEntry => (
      <GasBalanceSection key={subEntry[1]} team={entry[0]} name={subEntry[0]} address={subEntry[1]} />
    ))
  );
  return (
    <>
      <h2>Users Gas</h2>
      {balances}
    </>
  );
}

function MintSection() {
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [
      data.get('address') as string,
      parseUnits(data.get('amount') as string, 18)
    ];
    writeContract({
      abi: Coin.abi,
      address: coinAddress,
      functionName: 'mint',
      args: args
    });
  }

  return (
    <>
      <h2>Mint (create and send) HKOI Coin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Address: <input name='address' defaultValue='0x0123' size={50} />
        </div>
        <div>
          Amount: <input name='amount' defaultValue='1' />
        </div>
        <div>
          <button type='submit'>Mint</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function BatchMintSection() {
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS as Address;
  const { data, error, writeContract } = useWriteContract();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const csv = data.get('csv') as string;
    const addresses: string[] = [];
    const values: BigInt[] = [];
    csv.split(/\r?\n/).forEach(line => {
      const entries = line.split(',');
      if (entries.length !== 2) return;
      addresses.push(entries[0]);
      values.push(parseUnits(entries[1] as string, 18));
    });
    const args: any[] = [addresses, values];
    writeContract({
      abi: Coin.abi,
      address: coinAddress,
      functionName: 'batchMint',
      args: args
    });
  }

  return (
    <>
      <h2>Batch mint (create and send) HKOI Coin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea name='csv' defaultValue={'0x0123,1\n0x0456,2'} />
        </div>
        <div>
          <button type='submit'>Mint</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function SponsorBalanceSection() {
  const sponsorAddress = process.env.NEXT_PUBLIC_SPONSOR_ADDRESS as Address;
  const { data, status } = useBalance({address: sponsorAddress});
  if (status !== 'success') return;
  return (
    <>
      <h2>Sponsor Balance</h2>
      <div>{data.formatted} {data.symbol}</div>
    </>
  );
}

function SponsorWithdrawSection() {
  const sponsorAddress = process.env.NEXT_PUBLIC_SPONSOR_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [
      data.get('address') as string,
      parseUnits(data.get('amount') as string, 18)
    ];
    writeContract({
      abi: Sponsor.abi,
      address: sponsorAddress,
      functionName: 'withdrawTo',
      args: args
    });
  }

  return (
    <>
      <h2>Withdraw gas (ETH) from sponsor</h2>
      <div>Use this to grant admins some balance for gas.</div>
      <div>Note that you need some gas to invoke this function too...</div>
      <form onSubmit={handleSubmit}>
        <div>
          Address: <input name='address' defaultValue='0x0123' size={50} />
        </div>
        <div>
          Amount: <input name='amount' defaultValue='0.00001' />
        </div>
        <div>
          <button type='submit'>Withdraw</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function SponsorUsersSection() {
  const sponsorAddress = process.env.NEXT_PUBLIC_SPONSOR_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [parseUnits(data.get('amount') as string, 18)];
    writeContract({
      abi: Sponsor.abi,
      address: sponsorAddress,
      functionName: 'sponsorUserUpTo',
      args: args
    });
  }

  return (
    <>
      <h2>Sponsor all users</h2>
      <div>Send every user up to this amount x.</div>
      <div>If a user is previously sponsored with amount y, only max(0, x - y) will be sent.</div>
      <form onSubmit={handleSubmit}>
        <div>
          Amount: <input name='amount' defaultValue='0.00001' />
        </div>
        <div>
          <button type='submit'>Sponsor</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function ContractsSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as string;
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS as string;
  const sponsorAddress = process.env.NEXT_PUBLIC_SPONSOR_ADDRESS as string;
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as string;

  return (
    <>
      <h2>Contracts</h2>
      <div>For more admin operations (e.g remove user, pause coin transaction).</div>
      <ContractSection name={'Access'} address={accessAddress} />
      <ContractSection name={'Coin'} address={coinAddress} />
      <ContractSection name={'Sponsor'} address={sponsorAddress} />
      <ContractSection name={'Quiz'} address={quizAddress} />
    </>
  );
}

function FixQuizSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS as Address;
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as string;
  const { data: isAdmin, status } = useReadContract({
    abi: Access.abi,
    address: accessAddress,
    functionName: 'isAdmin',
    args: [quizAddress]
  });
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});
  if (status !== 'success' || isAdmin) return;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    writeContract({
      abi: Access.abi,
      address: accessAddress,
      functionName: 'addAdmin',
      args: [quizAddress]
    });
  }

  return (
    <>
      <h2>FixQuiz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <button type='submit'>Fix</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

type ContractProps = {
  name: string;
  address: string;
}

function ContractSection({ name, address }: ContractProps) {
  if (address === 'TODO') return;

  const url = addressLink(address) + '#writeContract';
  return <div>{name}: <a href={url} target='_blank'>{address}</a></div>;
}

function UsersSection({ userMap }: UserProps) {
  const balances = [...userMap.entries()].map(entry => [...entry[1].entries()]).flat().sort().map(entry => (
    <CoinBalanceSection key={entry[1]} team={''} name={entry[0]} address={entry[1]} />
  ));
  return (
    <>
      <h2>Users Balance</h2>
      {balances}
    </>
  );
}

type BalanceProps = {
  team: string;
  name: string;
  address: string;
}

function GasBalanceSection({ team, name, address }: BalanceProps) {
  const { data, status } = useBalance({address: address as Address});
  if (status !== 'success') return;
  return <div>{name} (team {team}) (<AddressSection hash={address} />): {data.formatted} {data.symbol}</div>;
}

function CoinBalanceSection({ team, name, address }: BalanceProps) {
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS as Address;
  const { data, status } = useBalance({address: address as Address, token: coinAddress});
  if (status !== 'success') return;

  function handleClick() {
    const e = document.getElementById('transfer_target');
    if (!e) return;
    (e as HTMLInputElement).value = address;
  }

  return <div>{name} <button onClick={handleClick}>{address}</button>: {data.formatted}</div>;
}

function SendSection() {
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [
      data.get('address') as string,
      parseUnits(data.get('amount') as string, 18)
    ];
    writeContract({
      abi: Coin.abi,
      address: coinAddress,
      functionName: 'transfer',
      args: args
    });
  }

  return (
    <>
      <h2>Transfer HKOI Coin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Address: <input name='address' defaultValue='0x0123' id='transfer_target' size={50} />
        </div>
        <div>
          Amount: <input name='amount' defaultValue='1' />
        </div>
        <div>
          <button type='submit'>Transfer</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function QuizSection() {
  return;
  return (
    <>
      <QuesionOneSection />
      <QuesionTwoSection />
      <QuesionThreeSection />
      <QuesionFourSection />
      <QuesionFiveSection />
    </>
  );
}

function QuesionOneSection() {
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [BigInt(data.get('answer') as string)];
    writeContract({
      abi: Quiz.abi,
      address: quizAddress,
      functionName: 'questionOne',
      args: args
    });
  }

  return (
    <>
      <h2>Question 1: Maths (10 Coin)</h2>
      <pre>
        <code>{`    function questionOne(uint256 answer) external onlyAdminOrUser {
        require(answer == 1 + 2 + 3);
        require(!answeredQuestionOne[tx.origin]);
        answeredQuestionOne[tx.origin] = true;
        coin.mint(tx.origin, 10 * 1e18);
    }`}</code>
      </pre>
      <form onSubmit={handleSubmit}>
        <div>
          Answer: <input name='answer' defaultValue='123' />
        </div>
        <div>
          <button type='submit'>Submit</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function QuesionTwoSection() {
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [BigInt(data.get('answer') as string)];
    writeContract({
      abi: Quiz.abi,
      address: quizAddress,
      functionName: 'questionTwo',
      args: args
    });
  }

  return (
    <>
      <h2>Question 2: Read Smart Contract (20 Coin)</h2>
      <pre>
        <code>{`    function questionTwo(uint256 answer) external onlyAdminOrUser {
        require(answer == doYouKnowWhereToFindMe);
        require(!answeredQuestionTwo[tx.origin]);
        answeredQuestionTwo[tx.origin] = true;
        coin.mint(tx.origin, 20 * 1e18);
    }`}</code>
      </pre>
      <form onSubmit={handleSubmit}>
        <div>
          Answer: <input name='answer' defaultValue='123' />
        </div>
        <div>
          <button type='submit'>Submit</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function QuesionThreeSection() {
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});
  const link = blockLink();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [BigInt(data.get('answer') as string)];
    writeContract({
      abi: Quiz.abi,
      address: quizAddress,
      functionName: 'questionThree',
      args: args
    });
  }

  return (
    <>
      <h2>Question 3: Dynamic answer (30 Coin)</h2>
      <div>
        <a href={link} target='_blank'>{link}</a>
      </div>
      <pre>
        <code>{`    function questionThree(uint256 answer) external onlyAdminOrUser {
        require(answer == block.number);
        require(!answeredQuestionThree[tx.origin]);
        answeredQuestionThree[tx.origin] = true;
        coin.mint(tx.origin, 30 * 1e18);
    }`}</code>
      </pre>
      <form onSubmit={handleSubmit}>
        <div>
          Answer: <input name='answer' defaultValue='123' />
        </div>
        <div>
          <button type='submit'>Submit</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function QuesionFourSection() {
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});
  const link = blockLink();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args = [BigInt(data.get('answer') as string)];
    writeContract({
      abi: Quiz.abi,
      address: quizAddress,
      functionName: 'questionFour',
      args: args
    });
  }

  return (
    <>
      <h2>Question 4: Mining simulator (10-320 Coin)</h2>
      <pre>
        <code>{`    function questionFour(uint256 answer) external onlyAdminOrUser {
        bytes32 hash = keccak256(abi.encode(tx.origin, answer));
        uint256 count = 0;
        for (uint256 i = 0; i < 32; i++) {
            if (uint8(hash[i]) == 0) {
                count++;
            }
        }
        require(count > answeredQuestionFour[tx.origin]);
        coin.mint(
            tx.origin,
            (count - answeredQuestionFour[tx.origin]) * 10 * 1e18
        );
        answeredQuestionFour[tx.origin] = count;
    }`}</code>
      </pre>
      <form onSubmit={handleSubmit}>
        <div>
          Answer: <input name='answer' defaultValue='123' />
        </div>
        <div>
          <button type='submit'>Submit</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function QuesionFiveSection() {
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS as Address;
  const config = useConfig();
  const { data, error, writeContract } = useWriteContract({config});
  const link = blockLink();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const args: any[] = [];
    writeContract({
      abi: Quiz.abi,
      address: quizAddress,
      functionName: 'questionFive',
      args: args
    });
  }

  return (
    <>
      <h2>Question 5: Sender vs Origin (40 Coin)</h2>
      <pre>
        <code>{`    function questionFive() external onlyAdminOrUser {
        require(msg.sender != tx.origin);
        require(!answeredQuestionFive[tx.origin]);
        answeredQuestionFive[tx.origin] = true;
        coin.mint(tx.origin, 40 * 1e18);
    }`}</code>
      </pre>
      <form onSubmit={handleSubmit}>
        <div>
          <button type='submit'>Submit</button>
        </div>
        {data && <ScanSection hash={data} />}
        {error && <div>{error.name}: {error.message}</div>}
      </form>
    </>
  );
}

function DeploysSection() {
  const accessAddress = process.env.NEXT_PUBLIC_ACCESS_ADDRESS;
  const coinAddress = process.env.NEXT_PUBLIC_COIN_ADDRESS;
  const sponsorAddress = process.env.NEXT_PUBLIC_SPONSOR_ADDRESS;
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_ADDRESS;

  return (
    <>
      {accessAddress === 'TODO' && (
        <DeploySection name={'Access'} abi={Access.abi} bytecode={Access.bytecode} args={[]} />
      )}
      {accessAddress !== 'TODO' && coinAddress === 'TODO' && (
        <DeploySection name={'Coin'} abi={Coin.abi} bytecode={Coin.bytecode} args={[accessAddress as string]} />
      )}
      {accessAddress !== 'TODO' && sponsorAddress === 'TODO' && (
        <DeploySection name={'Sponsor'} abi={Sponsor.abi} bytecode={Sponsor.bytecode} args={[accessAddress as string]} />
      )}
      {accessAddress !== 'TODO' && coinAddress !== 'TODO' && quizAddress === 'TODO' && (
        <DeploySection name={'Quiz'} abi={Quiz.abi} bytecode={Quiz.bytecode} args={[accessAddress as string, coinAddress as string]} />
      )}
    </>
  );
}

type DeployProps = {
  name: string;
  abi: Abi;
  bytecode: Hex;
  args: Array<string>;
}

function DeploySection({ name, abi, bytecode, args }: DeployProps) {
  const config = useConfig();
  const { data, error, deployContract } = useDeployContract({config});
  return (
    <div>
      <h2>Contract: {name}</h2>
      <button onClick={() => deployContract({abi, bytecode, args})}>
        Deploy
      </button>
      {data && <ScanSection hash={data} />}
      {error && <div>{error.name}: {error.message}</div>}
    </div>
  );
}

type HashProps = {
  hash: string;
}

function AddressSection({ hash }: HashProps) {
  return <a href={addressLink(hash)} target='_blank'>{hash}</a>;
}

function addressLink(hash: string): string {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case 'base': {
      return 'https://basescan.org/address/' + hash;
    }
    case 'base-sepolia': {
      return 'https://sepolia.basescan.org/address/' + hash;
    }
  }
  throw new Error('Unsupported chain');
}

function ScanSection({ hash }: HashProps) {
  const link = scanLink(hash);
  return (
    <div>
      <a href={link} target='_blank'>{link}</a>
    </div>
  );
}

function scanLink(hash: string): string {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case 'base': {
      return 'https://basescan.org/tx/' + hash
    }
    case 'base-sepolia': {
      return 'https://sepolia.basescan.org/tx/' + hash
    }
  }
  throw new Error('Unsupported chain');
}

function blockLink(): string {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case 'base': {
      return 'https://basescan.org/blocks'
    }
    case 'base-sepolia': {
      return 'https://sepolia.basescan.org/blocks'
    }
  }
  throw new Error('Unsupported chain');
}

export default App;
