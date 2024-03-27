export interface Fee {
  id: string;
  buildingId: string;
  serviceName: string;
  price: number;
  unit: string ;
  effectiveDate: string;
  expireDate: string | null;
  description: string | null;
  createUser: string;
  createTime: string; // Date string should be consistent with backend format
  modifyUser: string | null; // Optional field to allow null values
  modifyTime: string | null; // Optional field to allow null values
  status: number;
}
