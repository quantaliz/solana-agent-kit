declare module "x402-axios" {
  import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

  export type Hex = string;
  
  export interface Signer {
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
    signTransaction: (transaction: any) => Promise<any>;
    publicKey: string;
  }

  export type MultiNetworkSigner = {
    evm?: Signer;
    svm?: Signer;
  };

  export interface PaymentHeader {
    "x-request-cost": string;
    "x-payment-required": string;
    "x-destination-wallet": string;
    "x-payment-methods"?: string;
  }

  export interface PaymentResponse {
    tx_signature: string;
    payment_amount: string;
    recipient: string;
    status: string;
  }

  export function withPaymentInterceptor(
    axiosInstance: AxiosInstance,
    signer: Signer | MultiNetworkSigner
  ): AxiosInstance;

  export function createSigner(
    network: string,
    privateKey: Hex
  ): Promise<Signer>;

  export function decodeXPaymentResponse(
    headerValue: string
  ): PaymentResponse;

  export type { Hex, Signer, MultiNetworkSigner, PaymentHeader, PaymentResponse };
}