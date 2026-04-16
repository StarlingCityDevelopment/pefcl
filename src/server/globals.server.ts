import EventEmitter from 'events';
import { readFileSync } from 'fs';
import path from 'path';

const isMocking = process.env.NODE_ENV === 'mocking' || process.env.NODE_ENV === 'test';
export const mockedResourceName = 'pefcl';

// TODO: Move this into package
const convars = {
  mysql_connection_string: 'mysql://root@127.0.0.1/pefcl?charset=utf8mb4',
};

const players: any = {
  '2': {
    name: 'BingoBerra',
    license: 'license:1',
  },
  '3': {
    name: 'OtherGuy',
    license: 'license:2',
  },
};

if (isMocking) {
  const baseDir = path.resolve(__dirname + '/../../');
  const ServerEmitter = new EventEmitter().setMaxListeners(25);
  const NetEmitter = new EventEmitter().setMaxListeners(25);

  global.RegisterCommand = (cmd: string) => {
    console.log('Registered command', cmd);
  };

  global.LoadResourceFile = (_resourceName: string, fileName: string) => {
    const file = readFileSync(`${baseDir}/${fileName}`, 'utf-8');
    return file;
  };

  global.GetResourceState = () => {
    return 'Mocked';
  };

  global.GetCurrentResourceName = () => {
    return mockedResourceName;
  };

  global.GetPlayerName = (source: keyof typeof players) => {
    return players[source].name;
  };

  global.getPlayerIdentifiers = (source: keyof typeof players) => {
    return [players[source].license];
  };

  global.getPlayers = () => {
    return Object.keys(players);
  };

  global.GetResourcePath = () => {
    const path = '/';
    return path;
  };

  global.GetConvar = (convar: keyof typeof convars, fallback: string) => {
    return convars[convar] ?? fallback;
  };

  // Mutable mock state for cash tracking
  let mockCash = 2500;

  global.exports = () => ({
    qbx_pefcl: {
      addCash: (_source: number, amount: number) => {
        mockCash += amount;
        console.log(`global.server.ts: Adding cash ${amount} .. new balance: ${mockCash}`);
        return true;
      },
      getCash: () => {
        console.log(`global.server.ts: Getting cash .. balance: ${mockCash}`);
        return mockCash;
      },
      getBank: () => {
        console.log('global.server.ts: Getting bank ..');
        return 5000;
      },
      removeCash: (_source: number, amount: number) => {
        mockCash -= amount;
        console.log(`global.server.ts: Removing cash ${amount} .. new balance: ${mockCash}`);
        return true;
      },
      giveCard: () => {
        console.log('global.server.ts: Giving card ..');
        return true;
      },
      getCards: () => {
        console.log('global.server.ts: Getting cards ..');
        return [];
      },
    },
  });

  global.on = (event: string, listeners: (...args: any[]) => void) => {
    ServerEmitter.on(event, listeners);
  };

  global.onNet = (event: string, listeners: (...args: any[]) => void) => {
    NetEmitter.on(event, listeners);
  };

  global.removeEventListener = (event: string, listeners: (...args: any[]) => void) => {
    ServerEmitter.removeListener(event, listeners);
  };

  global.removeNetEventListener = (event: string, listeners: (...args: any[]) => void) => {
    NetEmitter.removeListener(event, listeners);
  };

  global.onceNet = (event: string, listeners: (...args: any[]) => void) => {
    NetEmitter.once(event, listeners);
  };

  global.emit = (event: string, ...args: any[]) => {
    ServerEmitter.emit(event, ...args);
  };

  global.emitNet = (event: string, ...args: any[]) => {
    NetEmitter.emit(event, ...args);
  };

  global.StopResource = (resource: string) => {
    console.log('global.server.ts: Stopping resource ..' + resource);
    process.exit(0);
  };
}
