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


module.exports = combineLists;