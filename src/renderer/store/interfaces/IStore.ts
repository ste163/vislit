// Renderer Store interface used by the const store: Store = inject("store")
// in child components to gain access to the store instance
import IApplicationStore from "./IApplicationStore";
import IProjectStore from "./IProjectStore";

export default interface IStore {
  application: IApplicationStore;
  projects: IProjectStore;
}
