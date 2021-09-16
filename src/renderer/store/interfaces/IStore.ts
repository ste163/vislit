// Renderer Store interface used by the const store: Store = inject("store")
// in child components to gain access to the store instance
import IProjectStore from "./IProjectStore";

export default interface IStore {
  projects: IProjectStore;

  // Need to move the activeView string into another place,
  // misc.?
  state: {
    activeView: string;
  };
  setters: {
    setActiveView: (view: string) => void | undefined;
  };
}
