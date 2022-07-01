import PersistenceManager from "@wisemapping/mindplot";
import { Designer } from '@wisemapping/mindplot';

declare global {
  var designer: Designer;
  var accountEmail: string;
}

declare global {
    interface Window {
        PersistenceManager: PersistenceManager;
    }
}

export {};
