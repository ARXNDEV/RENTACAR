import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCompanyData, setDistrictData, setLocationData, setModelData, setStateData } from "../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { setWholeData } from "../redux/user/selectRideSlice";
import { buildMasterDataLookups } from "../components/utils/masterDataUtils";

const useFetchLocationsLov = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchLov = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/getVehicleModels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const { models, brands, states, districts, locations, locationRows } = buildMasterDataLookups(data);

        dispatch(setModelData(models));
        dispatch(setCompanyData(brands));
        dispatch(setStateData(states));
        dispatch(setLocationData(locations));
        dispatch(setDistrictData(districts));
        dispatch(setWholeData(locationRows));

      } else {
        return "no data found";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchLov, isLoading };
};

export default useFetchLocationsLov;
