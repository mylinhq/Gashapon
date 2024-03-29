import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export * from './prizes';
export * from './tickets'

/** A dictionary that stores certain details from the user session to minimize database reads. */
export var cache = {
    shopTag: null,
    ticketData: null,
    prizeData: null,
    uid: null
}

/**
 * Stores data to memory in the form of an array.
 * If the data is not an array, it will be converted to
 * an array of length 1 before proceeding.
 * @param {String} key identifier to store data under in the cache dictionary 
 * @param {Array | any} data 
 * @returns the array of data currently cached under the given key 
 */
export function cacheAsArray(key, data) {
    // Make sure data is an array and convert if not
    if(!(data instanceof Array))
        data = [data];
    
    // Initialize array if no cache data exists
    if (!cache[key]) { 
        cache[key] = []
    }

    // Append to the list with ids
    for (let i = 0; i < data.length; i++) {
        data[i].id = cache[key].length + 1;
        cache[key] = Array.prototype.concat(cache[key], data[i]);
    }

    return cache[key];
}


/** Clears the cache dictionary (shopTag, ticketData, and uid) */
export function clearCachedData() {
    cache = {};
}


/**
 * Grabs the given user's configured shop / organization display name.
 * @param {*} uid user id
 * @returns {string} the user's shop display name
 */
export const getShopName = async (uid) => {
    let name;
    const ref = doc(db, "users", uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
        name = snapshot.data().shopDisplayName;
    }

    return name;
}


/**
 * Grabs a user's current shop tag from the database.
 * @param {*} uid user id
 * @returns {string} the shop tag that belongs to the given user id
 */
export const getUserShopTag = async (uid) => {
    var tag;
    if (cache.shopTag) {
        tag = cache.shopTag
    } else {
        var ref = doc(db, "users", uid);
        var snapshot = await getDoc(ref);

        if (snapshot.exists()) {
            tag = snapshot.data().shopTag;
            cache.shopTag = tag;
        } else {
            alert("No shop tag set!");
            tag = null;
        }
    }    

    return tag;
}

