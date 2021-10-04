// Renderer Store interface used by the const store: Store = inject("store")
// in child components to gain access to the store instance
import type IApplicationStore from "./IApplicationStore";
import type IProjectStore from "./IProjectStore";

export default interface IStore {
  application: IApplicationStore;
  projects: IProjectStore;
// eslint-disable-next-line semi
}
