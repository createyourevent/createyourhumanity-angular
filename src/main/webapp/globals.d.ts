import PersistenceManager from "@wisemapping/mindplot";

declare global {
    interface Window {
        PersistenceManager: PersistenceManager;
    }
}

export {};
