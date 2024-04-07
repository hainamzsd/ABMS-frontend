export interface Utility {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  numberOfSlot: number;
  pricePerSlot: number;
  description: string;
  createUser: string;
  createTime: string;
  location: string;
  modifyUser: string;
  modifyTime: string;
  status: number;
}

export interface UtilityCreation {
  name: string;
  buildingId: string;
  openTime: string;
  closeTime: string;
  numberOfSlot: number;
  pricePerSlot: number;
  description: string;
}

export interface UtilityDetail {
  id: string;
  name: string;
  utilityId: string;
  createUser: string;
  createTime: string;
  modifyUser: string;
  modifyTime: string;
  status: number;
}

export interface Reservation {
  id: string;
  room_id: string;
  utility_detail_id: string;
  slot: number;
  booking_date: string;
  number_of_person: string;
  total_price: number;
  description: string;
  status: number;
  utility: string;
  utility_detail_name: string;
  room_number:string;
}
