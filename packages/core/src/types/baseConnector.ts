export abstract class BaseConnector<Provider = any> {
  readonly chain: string;
  readonly name: string;
  abstract provider?: Provider;

  constructor(chain: string) {
    this.chain = chain;
  }

  abstract connect({
    chainId,
  }: {
    chainId?: string | undefined;
  }): Promise<void>;

  // DISCUSSION: We might wanna have the disconnect method only in the client as there is no specific function in wallets
  abstract disconnect(): Promise<void>;

  abstract getAccount(): Promise<string[]>;

  getChainId?(): Promise<string>;

  abstract getProvider(): Promise<Provider>;

  abstract resolveDid(address: string): Promise<string | null>;

  abstract signMessage(message: string): Promise<string>;

  switchChain?(chainId: string): Promise<void>;

  protected abstract onAccountsChanged(): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(): void;
}
