export const settings = {
  endpoints: [
    'https://opendata.rdw.nl/resource/nsk3-v9n7.json', // geoData parking areas // https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7
    'https://opendata.rdw.nl/resource/b3us-f26s.json' // Charging points // https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s
  ],
  sharedKey: 'areaid',
  keys: {
    areageometryastext: 'area',
    chargingpointcapacity: 'chargingPoints',
    areaid: 'areaId'
  },
  strictKeys: false
}