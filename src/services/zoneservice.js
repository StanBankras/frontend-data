// Esri installation for node: https://esri.github.io/arcgis-rest-js/guides/node/
import 'cross-fetch/polyfill';
import 'isomorphic-form-data';
import { request } from '@esri/arcgis-rest-request';
import * as environmentalZones from '../assets/data/milieuzones.json';

const zones = environmentalZones.default;

// Found out how to get geojson via: https://gis.stackexchange.com/questions/206313/accessing-geojson-from-arcgis-online-rest-api
const uri = 'https://services.arcgis.com/kE0BiyvJHb5SwQv7/arcgis/rest/services/Milieuzones_NL/FeatureServer/0/query?f=geojson&where=1%3D1&returnGeometry=true';

export async function fetchEnvironmentalZones() {
  try {
    return await request(uri); 
  } catch(err) { 
    console.log(err);
    return zones; 
  }
}

export default { fetchEnvironmentalZones };