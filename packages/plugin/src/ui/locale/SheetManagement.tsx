import React, {useState} from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setLocaleData } from "../state/localeSlice";
// English.
import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";
import Button, { IconButton } from "../components/Button";
import { TextBox } from "../components/Field";
import { useForm } from "react-hook-form";
import { CopyIcon, LinkBreak1Icon } from "@radix-ui/react-icons";
import { copyToClipboard, copyToClipboardAsync, clipWithSelection } from "../../lib/helpers";
import Tooltip from "../components/Tooltip";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
const CopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip content={copied ? "Sheet url copied" : "Copy sheet url"} contentProps={{
      onPointerDownOutside: (e) => {
        e.preventDefault();
      }
    }}>
      <IconButton
        onClick={(e) => {
          e.preventDefault();
          clipWithSelection(url);
          setCopied(true);
        }}
        onMouseOut={(e) => {
          if(copied) setCopied(false);
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

  const { register, handleSubmit, getValues } = useForm();

  const getRemoteData = () => {
    console.log("--Reload data--");
    axios.get(`http://localhost:8001/api/${sheetId}`).then((res) => {
      // setSyncedlocaleItems(res.data);
      dispatch(setLocaleData(res.data));
    });
  };
  const postRemoteData = () => {
    console.log("--Post data to google sheet");
    axios
      .post("http://localhost:8001/api/update", {
        sheetId: sheetId,
        items: localeItems,
      })
      .then((res) => {
        // console.log(res);
      });
  };
  const sync = () => {
    console.log(sheetId);
    axios.get(`http://localhost:8001/api/${sheetId}`).then((res) => {
      console.log({remote:res.data.modifiedTime, local:modifiedTime});
      if (
        new Date(res.data.modifiedTime).getTime() >
        new Date(modifiedTime).getTime()
      ) {
        dispatch(setLocaleData(res.data));
      } else {
        postRemoteData();
      }
    });
  };
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
        position: fixed;
        bottom: 0;
        border-top: 1px solid #eee;
        width: 100%;
        left: 0;
        padding: 12px 16px;
      `}
    >
      {sheetId ? (
        <div className="flex w-full">
          <div className="flex-grow-1">
            <div
              css={`
                /* button {
                  opacity: 0;
                  transition: all 0.2s;
                }
                &:hover {
                  button {
                    opacity: 1;
                  }
                } */
              `}
              className="flex gap-8"
            >
              <p
                css={`
                  margin: 0;
                  /* font-weight: var(--font-weight-medium); */
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
              <CopyButton url={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`} />
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
            {/* <Button variant="secondary" onClick={() => getRemoteData()}>
              Get
            </Button> */}
            <Button variant="secondary" onClick={() => sync()}>
              Sync
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(addSheetId)}
          className="flex w-full gap-8 align-items-end"
        >
          <TextBox
            label="Add a google sheet to continue"
            id="sheetId"
            className="flex-grow-1"
            {...register("sheetId")}
          ></TextBox>
          <Button type="submit">Add sheet</Button>
        </form>
      )}
    </footer>
  );
};
export default SheetManagement;
