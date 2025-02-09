import './i18n';
import './cl_events';
import './cl_exports';
import './cl_integrations';
import './cl_blips';
import { GeneralEvents, Broadcasts } from '@typings/Events';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { createInvoice, giveCash } from './functions';
import config from './cl_config';

let isAtmOpen = false;
let isBankOpen = false;
const useFrameworkIntegration = config.frameworkIntegration?.enabled;
const resourceName = GetCurrentResourceName();
const Delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const setBankIsOpen = (bool: boolean) => {
  if (isBankOpen === bool) {
    return;
  }

  isBankOpen = bool;
  SendNUIMessage({ app: 'PEFCL', method: 'setVisible', data: bool });

  console.log('setBankIsOpen', bool);

  SetNuiFocus(bool, bool);
};

export const setAtmIsOpen = (bool: boolean) => {
  if (isAtmOpen === bool) {
    return;
  }

  isAtmOpen = bool;
  SendNUIMessage({ app: 'PEFCL', method: 'setVisibleATM', data: bool });
  SetNuiFocus(bool, bool);
};

if (!useFrameworkIntegration) {
  RegisterCommand(
    'bank',
    () => {
      setBankIsOpen(!isBankOpen);
    },
    false,
  );

  RegisterCommand(
    'atm',
    () => {
      // Get position x amount units forward of the player or default to 5.0
      const plyPed = PlayerPedId();
      const [xp, yp, zp] = GetEntityCoords(plyPed, false);
      const [xf, yf, zf] = GetOffsetFromEntityInWorldCoords(
        plyPed,
        0.0,
        config.atms?.distance ?? 5.0,
        0.0,
      );

      // Create a test capsule and get raycast result
      const tc = StartShapeTestCapsule(xp, yp, zp, xf, yf, zf, 0.5, 16, 0, 4);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [retval, hit, endCoords, surfaceNormal, entityHit] = GetRaycastResult(tc);
      if (!hit) return console.log('not hit');
      const model = GetEntityModel(entityHit);
      if (!config.atms?.props?.includes(model)) return console.log('not atm');

      isAtmOpen = !isAtmOpen;
      SendNUIMessage({ app: 'PEFCL', method: 'setVisibleATM', data: isAtmOpen });

      if (isAtmOpen) {
        SetNuiFocus(true, true);
      } else {
        SetNuiFocus(false, false);
      }
    },
    false,
  );
}

RegisterNuiCB<void>(GeneralEvents.CloseUI, async () => {
  setBankIsOpen(false);
  setAtmIsOpen(false);

  emit('pefcl:closedUI');
});

if (!useFrameworkIntegration) {
  RegisterCommand(
    'cash',
    async () => {
      SetMultiplayerWalletCash();
      setTimeout(RemoveMultiplayerWalletCash, 5000);
    },
    false,
  );
}

if (!useFrameworkIntegration) {
  RegisterCommand('giveCash', giveCash, false);
  RegisterCommand('createInvoice', createInvoice, false);
}

const addMobileApp = async (lbProduct: string) => {
  if (lbProduct === 'lb-tablet') {
    const lbTabletExports = global.exports['lb-tablet'];

    await lbTabletExports.AddCustomApp({
      identifier: 'pefcl',
      name: 'Banking',
      description: 'Manage your financials with Fleeca Banking',
      developer: 'Fleeca',
      defaultApp: false, // OPTIONAL if set to true, app should be added without having to download it,
      size: 59812, // OPTIONAL in kb
      images: [
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/tablet_1.png`,
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/tablet_2.png`,
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/tablet_3.png`,
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/tablet_4.png`,
      ], // OPTIONAL array of images for the app on the app store
      ui: `https://cfx-nui-${resourceName}/web/dist/index.html#/mobile/dashboard`, // -- this is the path to the HTML file
      icon: `https://cfx-nui-${resourceName}/web/dist/media/app.png`, // -- OPTIONAL app icon
    });
  } else if (lbProduct === 'lb-phone') {
    const lbPhoneExports = global.exports['lb-phone'];

    await lbPhoneExports.AddCustomApp({
      identifier: 'pefcl',
      name: 'Banking',
      description: 'Manage your financials with Fleeca Banking',
      developer: 'Fleeca',
      defaultApp: false, // OPTIONAL if set to true, app should be added without having to download it,
      size: 59812, // OPTIONAL in kb
      images: [
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/phone_1.png`,
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/phone_2.png`,
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/phone_3.png`,
        `https://cfx-nui-${resourceName}/web/dist/media/appstore/phone_4.png`,
      ], // OPTIONAL array of images for the app on the app store
      ui: `https://cfx-nui-${resourceName}/web/dist/index.html#/mobile/dashboard`, // -- this is the path to the HTML file
      icon: `https://cfx-nui-${resourceName}/web/dist/media/app.png`, // -- OPTIONAL app icon
    });
  }
};

on(`onResourceStart`, async (resName: string) => {
  if (resName === 'lb-phone') {
    addMobileApp(resName);
  }

  if (resName === 'lb-tablet') {
    addMobileApp(resName);
  }
});

(async () => {
  if (GetResourceState('lb-phone') != 'started') return;
  addMobileApp('lb-phone');
})();

(async () => {
  if (GetResourceState('lb-tablet') != 'started') return;
  addMobileApp('lb-tablet');
})();
