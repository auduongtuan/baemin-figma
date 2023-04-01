import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setLocaleData } from "../../state/localeSlice";
import { Button, IconButton, TextBox, Tooltip, Dialog, Popover, WorkingIcon } from "ds";
import { useForm } from "react-hook-form";
import { CubeIcon, TableIcon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import SheetManagement from "../SheetManagement";
const AppBar = () => {
  const sheetId = useAppSelector((state) => state.locale.sheetId);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const isWorking = useAppSelector((state) => state.localeApp.isWorking);
  const { register, handleSubmit, getValues } = useForm();
  const dispatch = useAppDispatch();
  const addSheetId = (e) => {
    let sheetId = getValues().sheetId;
    const captureId = sheetId.match(/\/d\/(.+)\//);
    if (captureId) {
      sheetId = captureId[1];
    }
    dispatch(
      setLocaleData({
        sheetId: sheetId,
      })
    );
  };


  // console.log("Navigator", navigator.clipboard);
  return (
    <footer
      css={`
        justify-content: space-between;
        display: flex;
        /* position: fixed; */
        /* bottom: 0; */
        background: #fff;
        border-top: 1px solid #eee;
        width: 100%;
        /* left: 0; */
        padding: 12px 16px;
        flex-grow: 0;
        flex-shrink: 0;
      `}
    >
      <div className="flex-grow-1">
        <span className="text-secondary">v{import.meta.env.VITE_PLUGIN_VERSION}</span>
        {/* {isWorking && <WorkingIcon showText />} */}
        {/* <WorkingIcon /> */}
      </div>
      <div className="flex flex-grow-0 flex-shrink-0 gap-16">
        <Tooltip content="Generate Code">
          <IconButton
            onClick={() => {
              runCommand("export_code", { localeItems: localeItems });
            }}
          >
            <CubeIcon />
          </IconButton>
        </Tooltip>
        {/* {sheetId ? (
          <Dialog>
          <Tooltip content="Google sheet info">
          <Dialog.Trigger asChild>
            <IconButton>
              <TableIcon />
            </IconButton>
          </Dialog.Trigger>
          </Tooltip>
          <Dialog.Content title="Google sheet"><SheetManagement /></Dialog.Content>
          </Dialog>
        ) : 
        <Popover>
          <Tooltip content="Link Google sheet">
            <Popover.Trigger asChild>
              <IconButton>
                <TableIcon />
              </IconButton>
            </Popover.Trigger>
          </Tooltip>

          <Popover.Content title="Link Google sheet">
            <form onSubmit={handleSubmit(addSheetId)}>
              <TextBox
                label="Add a google sheet to continue"
                id="sheetId"
                className=""
                {...register("sheetId")}
              ></TextBox>
              <Button type="submit" className="mt-8">
                Add sheet
              </Button>
            </form>
          </Popover.Content>
        </Popover>
        } */}
      </div>
    </footer>
  );
};
export default AppBar;
