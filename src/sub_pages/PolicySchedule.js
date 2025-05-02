const dayWeekNm = ['일', '월', '화', '수', '목', '금', '토', '공휴일'];

const PolicySchedule = {
  setTimeList(flag, date) {
    if (date != '') {
      let optStr = '';
      let paramDate = date.split('|');

      for (let i = 0; i < paramDate.length / 2; i++) {
        let t_text = paramDate[i * 2 + 1].replace(/\./gi, ', ');
        if (t_text == '0') t_text = '전일사용';
        else if (t_text == '-1') t_text = '사용불가';
        else t_text = t_text + '시';

        let tmpStr = dayWeekNm[i] + ') ' + t_text; // 요일) 내용

        // 공휴일 앞으로
        if (i == 7) {
          optStr = tmpStr + '\n' + optStr;
        } else {
          if (i != 0) {
            optStr += ' , ';
          }
          optStr += tmpStr;
        }
      }
      return optStr;
    }
  },
};

export default PolicySchedule;
