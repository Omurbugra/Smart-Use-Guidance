const MINUTE_MS = 60 * 1000;
const DAY_MINUTES = 24 * 60;

function joinBasePath(relativePath) {
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '') + '/' + relativePath.replace(/^\//, '');
}

async function loadSingleColumn(fileName) {
  const res = await fetch(joinBasePath('data/' + fileName));
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
  const consumptionArr    = await loadSingleColumn('Electricity_Profile.csv');
  const productionArrRaw  = await loadSingleColumn('Electricity_Profile_PVProduction.csv');
  const lightingArr       = await loadSingleColumn('Electricity_Profile_GroupLighting.csv');
  const fridgesArr        = await loadSingleColumn('Electricity_Profile_GroupFridges.csv');
  const electronicsArr    = await loadSingleColumn('Electricity_Profile_GroupElectronics.csv');
  const inductiveArr      = await loadSingleColumn('Electricity_Profile_GroupInductive.csv');
  const otherArr          = await loadSingleColumn('Electricity_Profile_GroupOther.csv');
  const standbyArr        = await loadSingleColumn('Electricity_Profile_GroupStandby.csv');

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

    data.push({
      timestamp,
      consumption: consumptionArr[i],
      production: productionArr[i],
      cost_rate: 1,
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
