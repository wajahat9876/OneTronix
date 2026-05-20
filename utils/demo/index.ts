/* Demo mode — remove or disable when database is back online */

export const DEMO_EMAIL = 'demo@onetronix.com';
export const DEMO_PASSWORD = 'Demo2026!';
export const DEMO_AUTH_TOKEN = 'demo-onetronix-token';

export const isDemoMode = (authToken?: string) => authToken === DEMO_AUTH_TOKEN;

export const isDemoCredentials = (email: string, password: string) =>
  email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;

const DEMO_DEVICE = {
  _id: 'demo-device-1',
  deviceId: 'OTX-DEMO-001',
  isActive: true,
  name: 'Home Solar System',
  model: 'OneTronix Hybrid 5kW',
  type: 'hybrid',
};

export const DEMO_BUSINESS_USER = {
  auth_token: DEMO_AUTH_TOKEN,
  email: DEMO_EMAIL,
  firstName: 'Demo',
  lastName: 'User',
  isVerified: true,
  isBlocked: false,
  _id: 'demo-user-id',
  notificationCount: 2,
  devices: [DEMO_DEVICE],
  activeDevice: DEMO_DEVICE,
};

const now = () => new Date().toISOString();

const demoInverterPayload = () => ({
  status: 200,
  success: true,
  message: 'Demo inverter data',
  type: 'success',
  results: {
    inverterData: {
      data: {
        solar: { watt: 3.24, voltage: 385, amp: 8.4 },
        ac: {
          status: 'IMPORT',
          watt: 0.82,
          exportWatt: 0,
          voltage: 230,
          amp: 3.6,
          exportAmp: 0,
          freq: 50.0,
        },
        output: { watt: 2.18, voltage: 230, loadAmp: 9.5 },
        battery: {
          status: 'CHARGING',
          chargingWatt: 1.45,
          dischargingWatt: 0,
          chargingAmp: 28,
          inverterAmp: 0,
          voltage: 51.2,
        },
        hvdc: { voltage: 380 },
        temperature: { inverter: 42, booster: 38, mppt: 45 },
      },
      createdAtPK: now(),
    },
    dailySummary: {
      grid: { dailyPurchase: 4.25 },
      consumption: { dailyConsumption: 18.6 },
      production: { dailyProduction: 22.4 },
    },
    totalSummary: {
      production: { totalProduction: 8450.75 },
    },
  },
});

const demoAnalyticsPayload = (type: string) => {
  const isTotal = type === 'total';
  return {
    status: 200,
    success: true,
    message: 'Demo analytics',
    type: 'success',
    results: {
      production: {
        production: isTotal ? 8450.75 : 22.4,
        dailyProduction: 22.4,
        monthlyProduction: 582.5,
      },
      consumption: {
        consumption: isTotal ? 7120.3 : 18.6,
        dailyConsumption: 18.6,
        monthlyConsumption: 465.2,
      },
      battery: {
        charging: 5.2,
        discharging: 3.1,
        dailyCharging: 5.2,
        dailyDischarging: 3.1,
        monthlyCharging: 142.8,
        monthlyDischarging: 98.4,
      },
      grid: {
        export: 2.85,
        purchase: isTotal ? 1240.5 : 4.25,
        dailyPurchase: 4.25,
        dailyExport: 2.85,
        monthlyPurchase: 118.6,
        monthlyExport: 76.3,
      },
    },
  };
};

const solarWattForHour = (hour: number) => {
  if (hour < 6 || hour > 19) return 0;
  const peak = 4.8;
  const x = (hour - 12.5) / 3.5;
  return Math.max(0, Number((peak * Math.exp(-0.5 * x * x)).toFixed(2)));
};

const demoGraphPayload = (type: string) => {
  const today = new Date();
  const results: any[] = [];

  if (type === 'daily') {
    for (let hour = 0; hour < 24; hour += 1) {
      const solar = solarWattForHour(hour);
      const consumption = Number((1.2 + Math.random() * 1.8).toFixed(2));
      const purchase = Math.max(0, Number((consumption - solar * 0.6).toFixed(2)));
      const ts = new Date(today);
      ts.setHours(hour, 0, 0, 0);
      results.push({
        createdAtPK: ts.toISOString(),
        createdAt: ts.toISOString(),
        data: {
          solar: { watt: solar },
          output: { watt: consumption },
          ac: { watt: purchase, exportWatt: Math.max(0, solar - consumption) },
          battery: {
            chargingWatt: solar > consumption ? Number((solar - consumption).toFixed(2)) : 0,
            dischargingWatt: consumption > solar ? Number((consumption - solar).toFixed(2)) : 0,
          },
        },
      });
    }
  } else if (type === 'monthly') {
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const ts = new Date(year, month - 1, day);
      results.push({
        createdAt: ts.toISOString(),
        consumption: { dailyConsumption: Number((12 + (day % 7) * 1.4).toFixed(2)) },
        production: { dailyProduction: Number((14 + (day % 5) * 2.1).toFixed(2)) },
        battery: {
          dailyCharging: Number((3 + (day % 4)).toFixed(2)),
          dailyDischarging: Number((2 + (day % 3)).toFixed(2)),
        },
        grid: {
          dailyPurchase: Number((2 + (day % 6) * 0.5).toFixed(2)),
          dailyExport: Number((1 + (day % 5) * 0.4).toFixed(2)),
        },
      });
    }
  } else if (type === 'yearly') {
    const year = today.getFullYear();
    for (let month = 1; month <= 12; month += 1) {
      const ts = new Date(year, month - 1, 15);
      results.push({
        createdAt: ts.toISOString(),
        consumption: { monthlyConsumption: Number((380 + month * 12).toFixed(2)) },
        production: { monthlyProduction: Number((420 + month * 15).toFixed(2)) },
        battery: {
          monthlyCharging: Number((90 + month * 5).toFixed(2)),
          monthlyDischarging: Number((70 + month * 4).toFixed(2)),
        },
        grid: {
          monthlyPurchase: Number((95 + month * 3).toFixed(2)),
          monthlyExport: Number((60 + month * 2).toFixed(2)),
        },
      });
    }
  } else {
    const year = today.getFullYear();
    for (let y = year - 2; y <= year; y += 1) {
      results.push({
        createdAt: new Date(y, 6, 1).toISOString(),
        consumption: { yearlyConsumption: Number((4200 + (y - year + 2) * 320).toFixed(2)) },
        production: { yearlyProduction: Number((5100 + (y - year + 2) * 410).toFixed(2)) },
        battery: {
          yearlyCharging: Number((980 + (y - year + 2) * 80).toFixed(2)),
          yearlyDischarging: Number((760 + (y - year + 2) * 65).toFixed(2)),
        },
        grid: {
          yearlyPurchase: Number((1100 + (y - year + 2) * 90).toFixed(2)),
          yearlyExport: Number((720 + (y - year + 2) * 55).toFixed(2)),
        },
      });
    }
  }

  return {
    status: 200,
    success: true,
    message: 'Demo graph data',
    type: 'success',
    results,
  };
};

const getQueryParam = (url: string, key: string) => {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : '';
};

export const getDemoResponse = (url: string, method = 'GET') => {
  if (url.includes('user/auth/current')) {
    return {
      status: 200,
      success: true,
      message: 'Demo session',
      type: 'success',
      results: DEMO_BUSINESS_USER,
    };
  }

  if (url.includes('user/devices/inverterData')) {
    return demoInverterPayload();
  }

  if (url.includes('user/devices/summary')) {
    return demoGraphPayload(getQueryParam(url, 'type') || 'daily');
  }

  if (url.includes('user/devices/analytics')) {
    return demoAnalyticsPayload(getQueryParam(url, 'type') || 'daily');
  }

  if (url.includes('user/alerts')) {
    if (method === 'PUT') {
      return { status: 200, success: true, message: 'Notifications marked as read' };
    }
    return {
      status: 200,
      success: true,
      message: 'Demo alerts',
      type: 'success',
      results: {
        alerts: [
          {
            title: 'High Solar Production',
            message: 'System producing above daily average.',
            deviceRef: { name: DEMO_DEVICE.name, model: DEMO_DEVICE.model },
          },
          {
            title: 'Battery Fully Charged',
            message: 'Battery reached 100% capacity.',
            deviceRef: { name: DEMO_DEVICE.name, model: DEMO_DEVICE.model },
          },
        ],
      },
    };
  }

  if (method === 'PATCH' || method === 'PUT' || method === 'POST') {
    return { status: 200, success: true, message: 'Demo action completed' };
  }

  return {
    status: 200,
    success: true,
    message: 'Demo response',
    results: {},
  };
};
