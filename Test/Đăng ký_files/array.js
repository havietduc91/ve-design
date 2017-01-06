Sand.array = Sand.array || {};

Sand.array.shuffle = function (oldArray) {
    var newArray = oldArray.slice();
    var len = newArray.length;
    var i = len;
    while (i--) {
        var p = parseInt(Math.random() * len);
        var t = newArray[i];
        newArray[i] = newArray[p];
        newArray[p] = t;
    }
    return newArray;
};

Sand.array.remove_dupe_objects = function (objectsArray) {
    var usedObjects = {};

    for (var i = objectsArray.length - 1; i >= 0; i--) {
        var so = JSON.stringify(objectsArray[i]);

        if (usedObjects[so]) {
            objectsArray.splice(i, 1);

        } else {
            usedObjects[so] = true;
        }
    }

    return objectsArray;

};

Sand.array.remove_dupes = function (arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};

    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
};

Sand.array.remove_by_val = function (a, v) {
    var b = a;
    for (var i = 0; i < b.length; i++) {
        if (b[i] === v) {
            b.splice(i, 1);
            i--;
        }
    }
    return b;
};

//http://stackoverflow.com/a/26166303
Sand.array.object_to_array = function (obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
};

Sand.array.random_item = function (arr) {
    var n = Sand.array.shuffle(arr);
    return n[0];
};