type IconName = 'Sân bóng rổ' | 'Câu cá' | 'BBQ' | 'Chèo thuyền kayak';

const ICON_MAP: Record<string, any> = {
  'Sân bóng rổ': require('../assets/images/basketball.png'), 
  'Câu cá': require('../assets/images/fishing.png'),
  'BBQ': require('../assets/images/grill.png'),
  'Chèo thuyền kayak': require('../assets/images/kayak.png'),
  'Sân cầu lông':require('../assets/images/game.png'),
  'Bể bơi':require('../assets/images/swimming-pool.png'),
  'Bóng bàn':require('../assets/images/table-tennis.png'),
  'Sân tennis':require('../assets/images/tennis.png'),
};

  export default ICON_MAP;