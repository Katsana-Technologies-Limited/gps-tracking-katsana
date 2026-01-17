import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStatus: "All",
  selectedImeis: [],
  selectedLastImei: null,
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setSelectedStatus(state, action) {
      state.selectedStatus = action.payload;
    },
    setSelectedImeis(state, action) {
      state.selectedImeis = action.payload;
    },
    setSelectedLastImei(state, action) {
      state.selectedLastImei = action.payload;
    },
  },
});

export const { setSelectedStatus, setSelectedImeis, setSelectedLastImei } =
  vehiclesSlice.actions;
export default vehiclesSlice.reducer;
