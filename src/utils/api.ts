import { api } from './request';

// type MetaidService = {
//  };

export type MetaidItem = {
  number: number;
  rootTxId: string;
  name: string;
  nameId: string;
  address: string;
  avatar: string;
  avatarId: string;
  bio: string;
  bioId: string;
  soulbondToken: string;
  isInit: boolean;
};

export type Pin = {
  content: string;
  number: number;
  operation: string;
  height: number;
  id: string;
  type: string;
  path: string;
  rootId: string;
};

type Count = {
  block: number;
  Pin: number;
  metaId: number;
  app: number;
};

type MetaidService = {
  getMetaidList: (params: {
    page: number;
    size: number;
  }) => Promise<MetaidItem[]>;
  getPinList: (params: {
    page: number;
    size: number;
  }) => Promise<{ Pins: Pin[]; Count: Count; Active: string }>;
  getBlockList: (params: { page: number; size: number }) => Promise<{
    msgMap: Record<number, Pin[]>;
    msgList: number[];
    Active: string;
  }>;
  getMempoolList: (params: { page: number; size: number }) => Promise<{
    Count: Count;
    Active: string;
    Pins: Pin[];
  }>;
};

export const metaidService: MetaidService = {
  getMetaidList: (params) => api.get('/api/metaid/list', { params }),
  getPinList: (params) => api.get('/api/pin/list', { params }),
  //   getPin : (id) => api.get(`/api/pin/${id}`)
  getBlockList: (params) => api.get('/api/block/list', { params }),
  getMempoolList: (params) => api.get('/api/mempool/list', { params }),
  //   getNodeList : (params) => api.get('/api/node/list', { params })
};

export type FeeRateApi = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

export async function fetchFeeRate({
  netWork,
}: {
  netWork?: 'testnet' | 'mainnet';
}): Promise<FeeRateApi> {
  const response = await fetch(
    `https://mempool.space/${
      netWork === 'mainnet' ? '' : 'testnet'
    }/api/v1/fees/recommended`,
    {
      method: 'get',
    }
  );
  return response.json();
}
