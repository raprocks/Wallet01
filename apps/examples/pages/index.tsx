import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import  { Wallet } from '@huddle01-wallets/core'
import { useIsMounted } from 'usehooks-ts'
import { SolflareConnector, KeplrConnector } from '@huddle01-wallets/core/src/connectors'
import {SolflareProvider, SolanaProvider, KeplrProvider} from '@huddle01-wallets/core/src/providers'

export type CustomChainConfig = {
  chainNamespace: "eip155" | "solana" | "other";
  chainId: string;
  rpcTarget?: string;
  displayName: string;
  blockExplorer?: string;
  ticker: string;
  tickerName: string;
};

const defaultChainConfig: CustomChainConfig = {
  chainNamespace: 'eip155',
  chainId: 'secret-4',
  displayName: 'ethereum',
  ticker: 'ETH',
  tickerName: 'Ethereum'

}

const Home: NextPage = () => {

  const isMounted = useIsMounted()
  const [ account, setAccount ] = useState<string>()
  const [ did, setDid ] = useState<string | null>(null)

  const wallet = new Wallet<KeplrProvider>({chainConfig: defaultChainConfig, connector:  new KeplrConnector('secret-4')});

  const connect = async () => {
    if (!isMounted) throw new Error('No Window mounted')
    await wallet.connect()
    const account = await wallet.getAccount()
    setAccount(account)
  }

  const getDid = async () => {
    if (!account) throw new Error("No Account Found")
    const name = await wallet.getDid()
    console.log(name)
    setDid(name)
    return name
  }

  const signMessage = async () =>{
    await wallet.signMessage("hello")
  }

  const switchChain = async () => {
    await wallet.switchChain('chihuahua-1')
  }

  const getAccount = async () => {
    setAccount(await wallet.getAccount())
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={connect}>Connect Wallet</button>
      <span>{account}</span>
      <button onClick={getDid}>GetDID</button>
      <span>{did}</span>
      <button onClick={signMessage}>Sign Message</button>
      <button onClick={() => switchChain()}>Switch Chain</button>
      <button onClick={() => getAccount()}>Get Address</button>
        
    </div>
  )
}

export default Home