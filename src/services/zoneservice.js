// Esri installation for node: https://esri.github.io/arcgis-rest-js/guides/node/
import 'cross-fetch/polyfill';
import 'isomorphic-form-data';
import inside from 'point-in-polygon';
import { request } from '@esri/arcgis-rest-request';
import * as environmentalZones from '../assets/data/milieuzones.json';
import { replaceMultipleOccurences } from '../utils/helpers';

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

export function getCenterCoord(coordinates) {
  if(!coordinates) return [];
  const type = coordinates.split(' ')[0];
  let longLat = replaceMultipleOccurences(coordinates, [type + ' (', '(', ')', ','], '').split(' ');
  if(type === 'POINT') {
    longLat = [ Number(longLat[0]), Number(longLat[1]) ];
  } else {
    let latTotal = 0;
    let longTotal = 0;

    longLat.forEach((x, index) => {
      if(index === 0 || index % 2 === 0) return longTotal += Number(x);
      return latTotal += Number(x);
    });

    longLat = [ longTotal / (longLat.length / 2), latTotal / (longLat.length / 2) ];
  }

  return longLat;
}

export function getCenterCoordFromPolygon(polygon) {
  let latTotal = polygon.reduce((acc, curr) => acc + curr[1], 0);
  let longTotal = polygon.reduce((acc, curr) => acc + curr[0], 0);

  return [ longTotal / (polygon.length), latTotal / (polygon.length) ];
}

function getEnvironmentalZones(zones) {
  const polygons = [];
  zones.forEach(zone => {
    if(zone.geometry.type === 'MultiPolygon') {
      zone.geometry.coordinates.forEach(coordinateArray => {
        polygons.push({ municipality: zone.properties.Gemeente, polygon: coordinateArray });
      });      
    } else {
      polygons.push({ municipality: zone.properties.Gemeente, polygon: zone.geometry.coordinates })
    }
  });
  return polygons;
}

export function isCoordInEnvironmentalZone(centerCoord, geojson) {
  const polygons = getEnvironmentalZones(geojson.features);
  let zone = undefined;
  for(let i = 0;i < polygons.length;i++) {
    if(inside(centerCoord, polygons[i].polygon[0])) {
      zone = polygons[i].municipality; 
      break;
    }
  }
  return zone;
}

function getMunicipalityZones(zones) {
  const polygons = [];
  zones.forEach(zone => {
    if(zone.geometry.type === 'MultiPolygon') {
      zone.geometry.coordinates.forEach(coordinateArray => {
        polygons.push({ municipality: zone.properties.name, polygon: coordinateArray });
      });      
    } else {
      polygons.push({ municipality: zone.properties.name, polygon: zone.geometry.coordinates })
    }
  });
  return polygons;
}

export function isCoordInMunicipality(centerCoord, geojson) {
  const polygons = getMunicipalityZones(geojson.features);
  let zone = undefined;
  for(let i = 0;i < polygons.length;i++) {
    if(inside(centerCoord, polygons[i].polygon[0])) {
      zone = polygons[i].municipality; 
      break;
    }
  }
  return zone;
}