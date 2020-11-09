import fetch from 'node-fetch';
import inside from 'point-in-polygon';

const token = '$$app_token=' + process.env.VUE_APP_OPENDATA_RDW_APPTOKEN;

// Replace all occurences of the <replace> parameters in the <string> by the <replaceBy> parameter
export function replaceOccurences(string, replace, replaceBy) {
  return string.split(replace).join(replaceBy);
}

// Replace an array of characters in a string by new characters
export function replaceMultipleOccurences(string, replaceArray, replaceBy) {
  let replaceString = string;
  replaceArray.forEach((r) => replaceString = replaceOccurences(replaceString, r, replaceBy));
  return replaceString;
}

// Fetch data, for Opendata endpoints automatically attach app_token
export async function getData(uriString) {
  let uri = uriString;
  if(uri.includes('opendata')) {
    if(uri.endsWith('json')) {
      uri = uri + '?' + token + '&$limit=20000';
    } else if(uri.includes('$')) {
      uri = uri + '&' + token + '&$limit=20000';
    }
  }

  const result = await fetch(uri);
  const data = await result.json();
  return data;
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

