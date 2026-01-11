import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStatus: "All",
  selectedImeis: [],
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
  },
});

export const { setSelectedStatus, setSelectedImeis } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
