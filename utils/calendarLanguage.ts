import { LocaleConfig } from 'react-native-calendars';

export function setCalendarLocale(language: string) {
    switch(language) {
      case 'vi':
        LocaleConfig.locales['vi'] = {
          monthNames: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
          ],
          monthNamesShort: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'],
          dayNames: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
          dayNamesShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          today: "Hôm nay"
        };
        LocaleConfig.defaultLocale = 'vi';
        break;
        case 'en':
            LocaleConfig.locales['en'] = {
              monthNames: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ],
              monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July.', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              dayNamesShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              today: "Today"
            };
            LocaleConfig.defaultLocale = 'en';
            break;
      default:
        LocaleConfig.defaultLocale = 'vi'; 
    }
  }
  