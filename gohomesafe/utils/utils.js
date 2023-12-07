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


module.exports = {combineLists, dateAndTime};