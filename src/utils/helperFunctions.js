const jwt = require('jsonwebtoken');
function isNumeric(str) {
    return !isNaN(str);
}

const getPaginationValues = (pageNo = 1, size = 10) => {
    const page = Number.parseInt(pageNo || '1', 10);
    const limit = Number.parseInt(size || '10', 10);
    const skip = limit * (page - 1);
    return { limit, skip };
  };
const pagination = (skip = 0, limit = 10) => {
    return [{
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
    {
      $addFields: {
        totalCount: { $arrayElemAt: ['$totalCount.count', 0] },
      },
    },
    {
      $project: {
        data: 1,
        totalCount: { $ifNull: ['$totalCount', 0] },
        page: 1
      },
    }]
  };

const generateJsonWebToken = (user, expiresIn = '1d', jwt_secret) => {
    const secret = jwt_secret ? jwt_secret: process.env.JWT_SECRET; 
    return jwt.sign(user, secret, { expiresIn: expiresIn });
}

class DateFuncs {
  static initTime = {
    year: 1970,
    month: 1,
    date: 1,
    hour: 0,
    minute: 0,
    second: 0,
  };
  static isValid(date) {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    if (date === undefined) return false;
    return date?.getTime() === date?.getTime();
  }
  static parseTime(date) {
    if (date instanceof Date) return date;
    let thisDate;
    thisDate = new Date(date);
    if (this.isValid(thisDate)) return thisDate;
    thisDate = new Date(Number(date));
    if (this.isValid(thisDate)) return thisDate;
    return null;
  }
  static getDateRange(startDate, endDate) {
    const dates = [];
    const [thisStartDate, thisEndDate] = [
      this.parseTime(startDate),
      this.parseTime(endDate),
    ];
    let currentDate = new Date(thisStartDate);

    while (currentDate <= thisEndDate) {
      dates.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return dates;
  }

  static getStartOfDate(date) {
    const thisDate = this.parseTime(date);
    const convertedDate = new Date(
      Date.UTC(
        thisDate.getUTCFullYear(),
        thisDate.getUTCMonth(),
        thisDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    return convertedDate;
  }

  static getEndOfDate(date) {
    const thisDate = this.parseTime(date);
    const convertedDate = new Date(
      Date.UTC(
        thisDate.getUTCFullYear(),
        thisDate.getUTCMonth(),
        thisDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
    return convertedDate;
  }

  static getHMS(date) {
    const thisDate = this.parseTime(date);
    const hmsDate = new Date(
      Date.UTC(
        this.initTime.year,
        this.initTime.month,
        this.initTime.date,
        thisDate.getUTCHours(),
        thisDate.getUTCMinutes(),
        thisDate.getUTCSeconds(),
        thisDate.getUTCMilliseconds(),
      ),
    );
    return hmsDate;
  }

  static compareHMS(dt1, dt2) {
    const date1 = this.parseTime(dt1);
    const date2 = this.parseTime(dt2);
    const [hours1, minutes1, seconds1] = [
      date1.getUTCHours(),
      date1.getUTCMinutes(),
      date1.getUTCSeconds(),
    ];
    const [hours2, minutes2, seconds2] = [
      date2.getUTCHours(),
      date2.getUTCMinutes(),
      date2.getUTCSeconds(),
    ];

    // Compare the times
    if (hours1 !== hours2) return false;
    if (minutes1 !== minutes2) return false;
    if (seconds1 !== seconds2) return false;

    return true; // Times are equal
  }

  static timedelta(date, options) {
    let result = this.parseTime(date);
    if(options.years) {
      result.setUTCFullYear(result.getUTCFullYear() + options.years);
    }
    if (options.months) {
      result.setUTCMonth(result.getUTCMonth() + options.months);
    }
    if (options.days) {
      result.setUTCDate(result.getUTCDate() + options.days);
    }
    if (options.hours) {
      result.setUTCHours(result.getUTCHours() + options.hours);
    }
    if (options.minutes) {
      result.setUTCMinutes(result.getUTCMinutes() + options.minutes);
    }
    if (options.seconds) {
      result.setUTCSeconds(result.getUTCSeconds() + options.seconds);
    }
    if (options.milliseconds) {
      result.setUTCMilliseconds(result.getUTCMilliseconds() + options.milliseconds);
    }

    return result;
  }

  static combineDateAndTime(date, time) {
    const thisDate = this.parseTime(date);
    const thisTime = this.parseTime(time);

    if (thisDate && thisTime) {
      const convertedDate = new Date(
        Date.UTC(
          thisDate.getUTCFullYear(),
          thisDate.getUTCMonth(),
          thisDate.getUTCDate(),
          thisTime.getUTCHours(),
          thisTime.getUTCMinutes(),
          thisTime.getUTCSeconds(),
          thisTime.getUTCMilliseconds(),
        ))

      return convertedDate;

    }
    return thisDate;
  }
}

module.exports = { isNumeric, pagination, getPaginationValues, generateJsonWebToken, DateFuncs }