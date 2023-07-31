import { useEffect } from "react";
import io from "figma-helpers/io";
import { useAppDispatch } from "../hooks/redux";
import { setLocaleData, setTextsInLocaleSelection } from "../state/localeSlice";
import { setIsReady, setConfigs, setIsDevMode } from "../state/localeAppSlice";

export function useSetLocaleData() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    Promise.all([
      io.sendAndReceive("get_configs"),
      io.sendAndReceive("get_locale_data"),
    ]).then((data) => {
      const [getConfigsData, getLocaleData] = data;
      if (getConfigsData.configs) {
        dispatch(setConfigs(getConfigsData.configs));
      }
      if (getLocaleData.localeData) {
        dispatch(setLocaleData(getLocaleData.localeData));
      }
      dispatch(setIsReady(true));
    });
  }, []);
}

export function useUpdateLocaleSelection() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    io.on("change_locale_selection", (data) => {
      dispatch(setTextsInLocaleSelection(data.texts));
    });
  }, []);
}
export function useSetIsDevMode() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    io.once("dev_mode", (data) => {
      if (!data) return;
      const { devMode } = data;
      if (devMode) {
        dispatch(setIsDevMode(true));
      } else {
        dispatch(setIsDevMode(false));
      }
    });
  }, []);
}
