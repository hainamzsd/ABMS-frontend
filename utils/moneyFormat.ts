export function moneyFormat(number:number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

 export const formatVND = (money: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
  };