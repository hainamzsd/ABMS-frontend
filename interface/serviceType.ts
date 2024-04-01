export interface ServiceCharge {
  id: string;
  roomId: string;
  totalPrice: number;
  month: number;
  year: number;
  description: string;
  createUser: string;
  createTime: string;
  modifyUser: string | null;
  modifyTime: string | null;
  status: number;
}

export interface ServiceChargeTotal {
  year: number;
  month: number;
  total: number;
  status: number;
  detail: [
    {
      service_name: string;
      fee: number;
      amount: number;
      total: number;
    }
  ];
}
