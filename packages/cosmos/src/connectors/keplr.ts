import { Window as KeplrWindow } from '@keplr-wallet/types';
import { KeplrProvider } from '../providers/keplrProvider';
import { BaseConnector, setLastUsedConnector } from '@wallet01/core';
import emitter from '../utils/emiter';

declare const window: KeplrWindow;

export class KeplrConnector extends BaseConnector<KeplrProvider> {
  provider!: KeplrProvider;
  chain: string;
  name: string;

  constructor(chain: string = 'secret-4') {
    super(chain);
    this.chain = chain;
    this.name = 'Keplr';
  }

  async getProvider(): Promise<KeplrProvider> {
    if (typeof window !== 'undefined' && window.keplr) {
      this.provider = window.keplr;
      return this.provider;
    } else {
      throw new Error('Wallet Not Installed!');
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error('Provider undefined');
    try {
      await this.provider.enable(this.chain);
      const { bech32Address } = await this.provider.getKey(this.chain);
      return [bech32Address];
    } catch (error) {
      console.error(error);
      throw new Error('Error in getting accounts');
    }
  }

  async getChainId(): Promise<string> {
    return this.chain;
  }

  async switchChain(chainId: string): Promise<void> {
    if (!this.provider) throw new Error('Provider undefined');
    try {
      await this.provider.enable(chainId);
      console.log(this.chain);
      this.chain = chainId;
      console.log(this.chain);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async connect({ chainId = 'secret-4' }): Promise<void> {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new Error('Keplr not installed');

      await this.provider.enable(chainId);
      setLastUsedConnector(this.name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.chain = '';
    emitter.emit('disconnected');
  }

  async resolveDid(_address: string): Promise<string | null> {
    console.error("Cosmos Ecosystem doesn't support DIDs as of now");
    return null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error('Provider Undefined');
    try {
      console.log(this.chain, (await this.getAccount())[0]);
      const { signature } = await this.provider.signArbitrary(
        this.chain,
        (
          await this.getAccount()
        )[0],
        message
      );
      return signature;
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }

  protected onAccountsChanged(): void {
    console.log('Account Changed');
  }

  protected onChainChanged(_chain: string | number): void {
    console.log('Chain Changed');
  }

  protected onDisconnect(): void {
    console.log('Wallet disconnected');
  }
}
