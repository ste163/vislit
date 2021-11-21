import { reactive } from "vue";
import type IApplicationStore from "../interfaces/IApplicationStore";
import type ApplicationState from "../types/ApplicationState";

export default class ApplicationStore implements IApplicationStore {
  public state: ApplicationState;

  constructor() {
  	// TODO:
  	// Read last activeView state from localStorage; If none, set to "/"
  	// Columns needs to be pulled/saved in localStorage
  	this.state = reactive({
  		isSidebarMinimized: false, // read and save to localStorage
  		activeView: "/",
  		dropZones: [
  			{
  				name: "left",
  				maxWidth: "600px",
  				currentWidth: "0px",
  			},
  			{
  				name: "right",
  				maxWidth: "600px",
  				currentWidth: "0px",
  			},
  		],
  		columns: [
  			{
  				header: "Projects",
  				isActive: false,
  				dropZone: "left",
  				position: 0,
  				width: "300px",
  			},
  			{
  				header: "Notes",
  				isActive: false,
  				dropZone: "left",
  				position: 1,
  				width: "300px",
  			},
  			{
  				header: "Lexicons",
  				isActive: false,
  				dropZone: "left",
  				position: 2,
  				width: "300px",
  			},
  			{
  				header: "Settings",
  				isActive: false,
  				dropZone: "left",
  				position: 3,
  				width: "300px",
  			},
  		],
  	});
  }

  // Needs to be an arrow function to run the correct class instance
  setActiveView = (view: string): void => {
  	this.state.activeView = view;
  };

  setIsSidebarMinimized = (): void => {
	  // read from localStorage
	  // if no isSidebarMinimized, set to false
	  // else, set as localStorage value
	  this.state.isSidebarMinimized = !this.state.isSidebarMinimized;
  }
}
