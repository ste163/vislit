// Renderer Store interface used by the const store: Store = inject("store")
// in child components to gain access to the store instance
import type ApplicationStoreModel from "./ApplicationStoreModel";
import type ProjectStoreModel from "./ProjectStoreModel";

interface StoreModel {
  application: ApplicationStoreModel;
  projects: ProjectStoreModel;
}

export default StoreModel;
