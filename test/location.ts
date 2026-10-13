export function installLocationStub() {
  const state = { href: "http://localhost/" };
  const location = {
    assign(value: string) {
      state.href = value;
    },
    replace(value: string) {
      state.href = value;
    },
  };

  Object.defineProperty(location, "href", {
    configurable: true,
    get() {
      return state.href;
    },
    set(value: string) {
      state.href = value;
    },
  });

  Object.defineProperty(window, "location", {
    configurable: true,
    value: location,
  });

  return state;
}
