import React, { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setLocaleData } from "../state/localeSlice";
// English.
import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";
import Button, { IconButton } from "../components/Button";
import { CopyIcon, LinkBreak1Icon } from "@radix-ui/react-icons";
import {
  clipWithSelection
} from "../../lib/helpers";
import Tooltip from "../components/Tooltip";
import { runCommand } from "../uiHelper";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
// const API_URL = "http://localhost:8001/api/";
const API_URL = "https://baemin-figma.onrender.com/api";
const CopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip
      content={copied ? "Sheet url copied" : "Copy sheet url"}
      contentProps={{
        onPointerDownOutside: (e) => {
          e.preventDefault();
        },
      }}
    >
      <IconButton
        onClick={(e) => {
          e.preventDefault();
          clipWithSelection(url);
          setCopied(true);
        }}
        onMouseOut={(e) => {
          if (copied) setCopied(false);
        }}
      >
        <CopyIcon />
      </IconButton>
    </Tooltip>
  );
};
const SheetManagement = () => {
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const modifiedTime = useAppSelector((state) => state.locale.modifiedTime);
  const sheetId = useAppSelector((state) => state.locale.sheetId);
  const sheetName = useAppSelector((state) => state.locale.sheetName);
  const dispatch = useAppDispatch();
  const [isSyncing, setIsSyncing] = useState(false);
  const getRemoteData = () => {
    console.log("--Reload data--");
    axios.get(`${API_URL}/${sheetId}`).then((res) => {
      // setSyncedlocaleItems(res.data);
      dispatch(setLocaleData(res.data));
    });
  };
  const postRemoteData = () => {
    console.log("--Post data to google sheet");
    axios
      .post(`${API_URL}/update`, {
        sheetId: sheetId,
        items: localeItems,
      })
      .then((res) => {
        runCommand("show_figma_notify", {
          message: "Synced successfully TO Google sheet",
        });
        setIsSyncing(false);
      });
  };
  const sync = () => {
    console.log(sheetId);
    setIsSyncing(true);
    axios.get(`${API_URL}/${sheetId}`).then((res) => {
      console.log({ remote: res.data.modifiedTime, local: modifiedTime });
      if (
        new Date(res.data.modifiedTime).getTime() >
        new Date(modifiedTime).getTime()
      ) {
        dispatch(setLocaleData(res.data));
        runCommand("show_figma_notify", {
          message: "Synced successfully FROM Google sheet",
        });
        setIsSyncing(false);
      } else {
        postRemoteData();
      }
    });
  };
  return (
  <div className="flex w-full">
          <div className="flex-grow-1">
            <div
              className="flex gap-8"
            >
              <p
                css={`
                  margin: 0;
                `}
              >
                {sheetName}
              </p>
              <Tooltip content="Unlink sheet">
                <IconButton
                  onClick={() => dispatch(setLocaleData({ sheetId: null }))}
                >
                  <LinkBreak1Icon />
                </IconButton>
              </Tooltip>
              <CopyButton
                url={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
              />
            </div>

            <p
              css={`
                margin: 0;
                color: var(--figma-color-text-secondary);
              `}
              className="mt-4"
            >
              {localeItems && localeItems.length} items - Last sync{" "}
              {timeAgo.format(new Date(modifiedTime))}
            </p>
          </div>

          <div className="flex-shrink-0 flex-grow-0 flex gap-4">
            <Button
              variant="secondary"
              onClick={() => sync()}
              loading={isSyncing}
            >
              Sync
            </Button>
          </div>
        </div>
  );
}
export default SheetManagement;