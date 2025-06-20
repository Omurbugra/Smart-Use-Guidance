const MINUTE_MS = 60 * 1000;
const DAY_MINUTES = 24 * 60; // 1440 dakika

async function loadSingleColumn(path) {
  const res = await fetch(path);
  const text = await res.text();
  return text
      .trim()
      .split(/\r?\n/)
      .map(line => {
        const v = parseFloat(line.replace(',', '.'));
        return isNaN(v) ? 0 : v;
      });
}

export async function loadData() {
  const consumptionArr = await loadSingleColumn('/data/Electricity_Profile.csv'); // Wh
  const productionArrRaw  = await loadSingleColumn('/data/Electricity_Profile_PVProduction.csv'); // Wh

  const lightingArr    = await loadSingleColumn('/data/Electricity_Profile_GroupLighting.csv');
  const fridgesArr     = await loadSingleColumn('/data/Electricity_Profile_GroupFridges.csv');
  const electronicsArr = await loadSingleColumn('/data/Electricity_Profile_GroupElectronics.csv');
  const inductiveArr   = await loadSingleColumn('/data/Electricity_Profile_GroupInductive.csv');
  const otherArr       = await loadSingleColumn('/data/Electricity_Profile_GroupOther.csv');
  const standbyArr     = await loadSingleColumn('/data/Electricity_Profile_GroupStandby.csv');

  // Negatif üretimleri pozitife çevir
  const productionArr = productionArrRaw.map(Math.abs);

  const length = Math.min(
      consumptionArr.length,
      productionArr.length,
      lightingArr.length,
      fridgesArr.length,
      electronicsArr.length,
      inductiveArr.length,
      otherArr.length,
      standbyArr.length
  );

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const minutesSinceStart = Math.floor((now - startOfYear) / MINUTE_MS);

  const endIndex = Math.min(minutesSinceStart, length - 1);
  const startIndex = Math.max(endIndex - DAY_MINUTES, 0);

  const data = [];

  for (let i = startIndex; i <= endIndex; i++) {
    const timestamp = startOfYear.getTime() + i * MINUTE_MS;

    // Her zaman Wh kullanıyoruz ama ihtiyaç olduğunda kWh'a bölünecek (örneğin cost hesaplamaları)
    data.push({
      timestamp,
      consumption: consumptionArr[i],   // Wh
      production: productionArr[i],     // Wh (pozitif)
      cost_rate: 1,                      // birim kWh fiyatı
      categories: {
        lighting: lightingArr[i],
        fridges: fridgesArr[i],
        electronics: electronicsArr[i],
        inductive: inductiveArr[i],
        other: otherArr[i],
        standby: standbyArr[i]
      }
    });
  }

  return data;
}
