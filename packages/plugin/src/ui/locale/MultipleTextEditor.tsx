import React from "react";
import { useAppSelector } from "../hooks/redux";
import Tooltip from "../components/Tooltip";
import { IconButton } from "../components/Button";
import { ChatBubbleIcon, GlobeIcon, MagicWandIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { runCommand } from "../uiHelper";
import { pluralize } from "@capaj/pluralize";
import TextEditor from "./TextEditor";
import DropdownMenu from "../components/DropdownMenu";
import { LANGUAGES } from "../../constant/locale";
const MultipleTextEditor = () => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  return localeSelection && localeSelection.texts ? (
    <div className="p-16">
      <header className="flex align-items-center">
        <h4 className="mt-0 flex-grow-1 font-medium text-secondary">
          {localeSelection.texts.length}{" "}
          {pluralize("text", localeSelection.texts.length)} in selection
        </h4>
        <div className="flex gap-8 flex-shrink-0">
         
         
          <Tooltip content="Auto assign key">
            <IconButton
              onClick={() => {
                runCommand("auto_set_key", {
                  localeItems,
                });
              }}
            >
              <MagicWandIcon />
            </IconButton>
          </Tooltip>
          {/*
          <Tooltip content="Set key for all texts">
            <IconButton
              onClick={() => {
               
              }}
            >
              <MixerHorizontalIcon />
            </IconButton>
          </Tooltip> */}
          <Tooltip content="Create annotation for selection">
            <IconButton
              onClick={() => {
               runCommand("create_annotation");
              }}
            >
              <ChatBubbleIcon />
            </IconButton>
          </Tooltip>
        </div>
      </header>
      <div className="mt-16 flex flex-column gap-16">
        {localeSelection.texts.map((text) => {
          return (
            // <Accordion type="single" key={text.id + "_edit"} collapsible defaultChecked={true}>
            <TextEditor text={text}></TextEditor>
            // </Accordion>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default MultipleTextEditor;
