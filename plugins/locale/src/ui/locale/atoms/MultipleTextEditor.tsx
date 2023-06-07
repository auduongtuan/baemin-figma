import React from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  useLocaleSelection,
  useLocaleItems,
  useDefaultLanguage,
} from "../../hooks/locale";
import { Tooltip, IconButton } from "ds";
import {
  ChatBubbleIcon,
  MagicWandIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { pluralize } from "@capaj/pluralize";
import TextEditForm from "./TextEditForm";
import { MIXED_VALUE } from "../../../lib";
const MultipleTextEditor = () => {
  const localeSelection = useLocaleSelection();
  const defaultLanguage = useDefaultLanguage();
  const localeItems = useLocaleItems();
  return localeSelection && localeSelection.texts ? (
    <div className="p-16">
      <header className="flex items-center">
        <h4 className="mt-0 grow font-medium text-secondary">
          {localeSelection.texts.length}{" "}
          {pluralize("text", localeSelection.texts.length)} in selection
        </h4>
        <div className="flex gap-8 shrink-0">
          <Tooltip content="Update texts to latest content">
            <IconButton
              onClick={() => {
                runCommand("update_texts", {
                  items: localeItems,
                });
                runCommand("show_figma_notify", { message: "Texts updated" });
              }}
            >
              <UpdateIcon />
            </IconButton>
          </Tooltip>
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
                runCommand("create_annotation", {
                  localeTexts: localeSelection.texts,
                });
              }}
            >
              <ChatBubbleIcon />
            </IconButton>
          </Tooltip>
        </div>
      </header>
      <div className="mt-16 flex flex-col gap-16">
        {localeSelection.texts.map((text) => {
          return <TextEditForm key={text.id} text={text}></TextEditForm>;
        })}
      </div>
    </div>
  ) : null;
};

export default MultipleTextEditor;
