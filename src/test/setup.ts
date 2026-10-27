if (typeof window !== "undefined" && typeof Storage !== "undefined") {
  const store = new Map<string, string>();
  Storage.prototype.getItem = function (key: string) {
    return store.has(key) ? store.get(key)! : null;
  };
  Storage.prototype.setItem = function (key: string, value: string) {
    store.set(key, String(value));
  };
  Storage.prototype.removeItem = function (key: string) {
    store.delete(key);
  };
  Storage.prototype.clear = function () {
    store.clear();
  };
  Object.defineProperty(Storage.prototype, "length", {
    get: function () {
      return store.size;
    },
    configurable: true,
  });
  Storage.prototype.key = function (index: number) {
    return Array.from(store.keys())[index] ?? null;
  };

  const storageInstance = Object.create(Storage.prototype);
  Object.defineProperty(window, "localStorage", {
    value: storageInstance,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: storageInstance,
    writable: true,
    configurable: true,
  });
}
