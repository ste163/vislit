import { reactive } from "vue";
import Store from "@/interfaces/Store";

// Global state, setters, & getters
const state = reactive({
  activeView: "/",
});

const setters = {
  setActiveView: (view: string): void => {
    state.activeView = view;
  },
};

const store: Store = {
  state,
  setters,
};

export default store;
