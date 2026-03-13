import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modelData: [],
  companyData: [],
  stateData: [],
  locationData: [],
  districtData : [],
  wholeData: [],
  loading: false,
};

export const ModelDataSlice = createSlice({
  name: "modelDataSlice",
  initialState: initialState,
  reducers: {
    setModelData: (state, action) => {
      state.modelData = action.payload;
    },
    setCompanyData: (state, action) => {
      state.companyData = action.payload;
    },
    setStateData: (state, action) => {
      state.stateData = action.payload;
    },
    setLocationData: (state, action) => {
      state.locationData = (action.payload)
    },
    setDistrictData : (state,action)=> {
      state.districtData = action.payload;
    },
    setWholeData : (state,action)=> {
      state.wholeData = action.payload;
    }
  },
});

export const { setModelData ,setCompanyData, setStateData, setLocationData , setDistrictData, setWholeData} = ModelDataSlice.actions;
export default ModelDataSlice.reducer;
