import moment from 'moment'

export const isNull = (value) => [null, undefined, ''].includes(value) || value.length == 0 || Object.keys(value).length === 0

export const setInState = (ev, state, callback) => {
    const { name, value } = ev.target

    callback({
        ...state,
        [name]: value
    })
}

export const inStorage = (key, data, rememberMe = false) =>
    rememberMe ?
        localStorage.setItem(key, data) :
        sessionStorage.setItem(key, data)

export const fromStorage = key => 
    localStorage.getItem(key) || sessionStorage.getItem(key)

export const clearStorage = key => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
}

export const dtFormat = (dt, format = 'MMM D, YYYY') => moment(dt).format(format)

export const imgUrl = filepath => `${import.meta.env.VITE_API_PRO_URL}/${filepath}`

export const getDaysNumbers = (startDate, endDate) => {
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    let count = 0;

    while (currentDate <= endDateObj) {
        count++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
};