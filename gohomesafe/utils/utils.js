function combineLists(ids, coordinates) {
    if (ids.length !== coordinates.length) {
        throw new Error('Lists should be of the same length');
    }

    let combinedList = [];
    for (let i = 0; i < ids.length; i++) {
        let newItem = {
            id: ids[i],
            coordinates: coordinates[i]
        };
        combinedList.push(newItem);
    }
    return combinedList;
}

function dateAndTime() {
    const date = new Date();
    const optionsDate = { timeZone: 'Asia/Seoul', dateStyle: 'full' };
    const dateString = date.toLocaleString('en-US', optionsDate);

    const optionsTime = { timeZone: 'Asia/Seoul', timeStyle: 'long', hour12: false};
    const timeString = date.toLocaleString('en-US', optionsTime);

    const dateAndTimeString = dateString + " " + timeString;

    return dateAndTimeString;
}

function getRecommendation (weather) {
    const timeStamp = Math.floor(new Date() / 1000);
    let dayLight = false;
    let badConditions = false;   
    const listBadConditions =  [200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 302, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531 , 601, 602, 611, 612, 613, 615, 616, 620, 621, 622, 701, 711, 721, 731, 741, 751, 761, 762, 771, 781];

    if (timeStamp >= weather.sunrise && timeStamp <= weather.sunset) {
        dayLight = true;
    }
    if (listBadConditions.includes(weather.id)) {
        badConditions = true;
    }

    if (dayLight && badConditions) {
        return `not walking because of ${weather.description}`;
    }
    else if (dayLight && !badConditions) {
        return `walking as it is bright outside and ${weather.description}`;
    }
    else if (!dayLight && badConditions) {
        return `not walking as it is dark outside and ${weather.description}`;
    }
    else if (!dayLight && !badConditions) {
        return `being careful when walking as it is dark outside and ${weather.description}`;
    }
}


module.exports = {combineLists, dateAndTime, getRecommendation};