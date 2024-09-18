import { API } from '../main'

const prefix = '/dictionary'

const getCountryList = () => {
    return API.get(`${prefix}/countryList`)
}
const getCityList = ( countryId :Number,pageNumber :Number ) => {
    return API.get(`${prefix}/cityList?countryId=${countryId}&pageNumber=${pageNumber}`)
}
const getInterestList = () => {
    return API.get(`${prefix}/interestList`)
}
const getInterestListGrouped = () => {
    return API.get(`${prefix}/interestListGrouped`)
}

const postLoadCities = (countryExternalId: Number) => {
    return API.post(`${prefix}/loadCities?countryExternalId=${countryExternalId}`)
}
const postLoadCountries = () => {
    return API.post(`${prefix}/loadCountries`)
}


export { getCountryList , getCityList , getInterestList , getInterestListGrouped , postLoadCities , postLoadCountries }
