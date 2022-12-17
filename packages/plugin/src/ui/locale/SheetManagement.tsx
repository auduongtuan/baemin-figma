import React from "react";
import { css } from "@emotion/react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  setLocaleData
} from "../state/localeSlice";
// English.
import TimeAgo from 'javascript-time-ago'
// English.
import en from 'javascript-time-ago/locale/en'
import { Button, Field } from "../uiComponents";
import { useForm } from "react-hook-form";
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const SheetManagement = () => {
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const modifiedTime = useAppSelector((state) => state.locale.modifiedTime);
  const sheetId = useAppSelector((state) => state.locale.sheetId);
  const dispatch = useAppDispatch();

  const {register, handleSubmit, getValues} = useForm();

  const getRemoteData = () => {
    console.log("--Reload data--");
     axios
      .get(
        `http://localhost:8001/api/${sheetId}`
      )
      .then((res) => {
        // setSyncedlocaleItems(res.data);
        console.log(res.data);  
        dispatch(setLocaleData(res.data));
        console.log(modifiedTime);
      });
  }
  const postRemoteData = () => {
    console.log('--Post data to google sheet');
    axios.post('http://localhost:8001/api/update', {
      sheetId: sheetId,
      items: localeItems
    }).then((res) => {
      console.log(res);
    })
  }
  const addSheetId = (e) => {
    dispatch(setLocaleData({
      sheetId: getValues().sheetId
    }))
 
  }
  return (
    
    <footer css={css`
    justify-content: space-between;
    display: flex;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #eee;
    width: 100%;
    left: 0;
    padding: 12px 16px;
  `}>
    {
      sheetId ? <div>
      <a href=''>{localeItems && localeItems.length} locale items</a>
      <p css={css`margin: 0; color: var(--figma-color-text-secondary)`}>Last sync {timeAgo.format(new Date(modifiedTime))}</p>
      <Button onClick={() => dispatch(setLocaleData({sheetId: null}))}>Remove sheet</Button>
      <div className="flex gap-4">
      <Button variant="secondary" onClick={() => getRemoteData()}>Get</Button>
      <Button variant="secondary" onClick={() => postRemoteData()}>Post</Button>
      </div>
      </div> : <form onSubmit={handleSubmit(addSheetId)}>
        <Field label='Add a google sheet to continue' id='sheetId' {...register('sheetId')}></Field>
        <Button type="submit">Add sheet</Button>
      </form>
    }
   
  </footer>

  )
}
export default SheetManagement;