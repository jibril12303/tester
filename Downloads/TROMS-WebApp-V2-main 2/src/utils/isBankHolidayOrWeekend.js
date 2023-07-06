/**
 * Returns true if a given date is a weekend or bank holiday
 * @param { Date } day
 */
import moment from 'moment';
import axios from 'axios';

//determine if given day is bank holiday
async function weekendOrBankHoliday(day) {
    let isday = false;
    if (moment(day).day() == 0 || moment(day).day() == 6) {
        return true;
    }
    const response = await axios.get('https://www.gov.uk/bank-holidays.json');
    let bankHolidayList = response['data']['england-and-wales']['events'];

    for (item in bankHolidayList) {
        if (bankHolidayList[item]['date'] == day) {
            isday = true;
            break;
        }
    }

    return isday;
}

export default weekendOrBankHoliday;
