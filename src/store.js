import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "./slices/vehiclesSlice";

const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
  },
});

export default store;
