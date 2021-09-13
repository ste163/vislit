// Renderer Store interface used by the const store: Store = inject("store")
// in child components to gain access to the store instance

export default interface Store {
  state: {
    activeView: string;
  };
  setters: {
    setActiveView: (view: string) => void;
  };
}
