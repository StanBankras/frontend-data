import { getData } from '../utils/helpers';
import * as npropendata from '../assets/data/extras.json';

const npropendataArray = npropendata.default;

export async function getNpropendata(areaId) {
  try {
    if (npropendataArray.find(x => x.areaId === areaId)) return npropendataArray.find(x => x.areaId === areaId);
    console.log(areaId);
    const uuidReq = await getData('https://opendata.rdw.nl/resource/mz4f-59fw.json?areaid=' + areaId); // https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-PARKEERGEBIED/mz4f-59fw
    if (!uuidReq || !uuidReq[0] || !uuidReq[0].uuid) return null;

    const uuidData = await getData('http://cors-anywhere.herokuapp.com/https://npropendata.rdw.nl//parkingdata/v2/static/' + uuidReq[0].uuid);
    if (!uuidData) return null;

    return {
      tariffs: formatTariffData((uuidData.parkingFacilityInformation.tariffs || [])),
      specifications: (uuidData.parkingFacilityInformation.specifications || [])
    };
  } catch (err) {
    console.log(err);
    return null;
  }
} 

// export async function getTariffs(areaId) {
//   try {
//     if (Object.prototype.hasOwnProperty.call(tariffsObject, areaId)) return tariffsObject[areaId];
//     console.log(areaId);
//     const uuidReq = await getData('https://opendata.rdw.nl/resource/mz4f-59fw.json?areaid=' + areaId); // https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-PARKEERGEBIED/mz4f-59fw
//     if (!uuidReq || !uuidReq[0] || !uuidReq[0].uuid) return null;

//     const uuidData = await getData('http://cors-anywhere.herokuapp.com/https://npropendata.rdw.nl//parkingdata/v2/static/' + uuidReq[0].uuid);
//     if (!uuidData) return null;

//     return formatTariffData((uuidData.parkingFacilityInformation.tariffs || []));
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// }

function formatTariffData(tariffs) {
  const tariffObj = {};

  tariffs.forEach(tariff => {
    if (notExpiredTariff(tariff)) {
      tariff.validityDays.forEach(day => {
        const dayKey = day.split(' ').join('').toLowerCase();
        if (tariffObj[dayKey]) return;
        tariffObj[dayKey] = {
          validFrom: tariff.validityFromTime,
          validUntil: tariff.validityUntilTime,
          rateInterval: tariff.rateIntervals,
          averageTariff: getAverageTariffPerMinute(tariff)
        };
      });
    }
  });

  return tariffObj;
}

// Returns boolean true if tariff is currently valid
function notExpiredTariff(tariff) {
  return tariff.startOfPeriod * 1000 < Date.now() && (tariff.endOfPeriod * 1000 > Date.now() || !tariff.endOfPeriod || tariff.endOfPeriod === -1);
}

// To-do: add other time formats (seconds, hours)
function getAverageTariffPerMinute(tariff) {
  if (!tariff.intervalRates) return null;

  const minutesInDay = 1440;
  let weightedTotalCharge = 0;
  let totalMinutes = 0;

  tariff.intervalRates.forEach(rate => {
    const minutes = rate.durationUntil === -1 ? minutesInDay - rate.durationFrom : rate.durationUntil - rate.durationFrom;
    const charge = rate.charge
    const chargePeriod = rate.chargePeriod;
    const weightedCharge = charge * minutes / chargePeriod;
    weightedTotalCharge += weightedCharge;
    totalMinutes += minutes;
  });

  return weightedTotalCharge / totalMinutes;
}

export default { formatTariffData, notExpiredTariff, getAverageTariffPerMinute, getNpropendata }