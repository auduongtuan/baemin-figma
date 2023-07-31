import { useAppSelector } from "@ui/hooks/redux";
import { useLocaleSelection } from "../hooks/locale";
import MainSekeleton from "../locale/atoms/MainSkeleton";
import { CopyIcon, TextIcon } from "@radix-ui/react-icons";
import { Description, Divider, Switch, Tooltip } from "ds";
import LocaleItemList from "@ui/locale/items/LocaleItemList";
import ViewDialog from "@ui/locale/dialogs/ViewDialog";
import { pluralize } from "@capaj/pluralize";
import { CopyTooltip, IconButton } from "ds";
import { UpdateIcon } from "@radix-ui/react-icons";
import { LocaleText } from "../../lib";
import { useState } from "react";

const DevText = ({
  text,
  showVariables = false,
  last = false,
}: {
  text: LocaleText;
  showVariables?: boolean;
  last?: boolean;
}) => {
  const hasVariables = Object.keys(text.variables).length > 0;
  const jsonVariables = JSON.stringify(text.variables);
  return (
    <div className="group">
      <div className="flex items-center w-full font-normal text-left text-small group">
        <TextIcon className="w-16 h-16 mr-8 text-secondary shrink-0 grow-0" />
        <div className="font-medium truncate grow shrink">
          {text.characters}
        </div>
        {text.key && (
          <div className="flex gap-12 opacity-0 group-hover:opacity-100 grow-0 shrink-0">
            <CopyTooltip
              copyContent="Copy key"
              copiedContent="Key copied"
              stringToCopy={text.key}
            >
              <IconButton>
                <CopyIcon />
              </IconButton>
            </CopyTooltip>
            <CopyTooltip
              copyContent="Copy t code"
              copiedContent="Code copied"
              stringToCopy={`t("${text.key}"${
                hasVariables ? `, ${jsonVariables}` : ""
              })`}
            >
              <IconButton>
                <CopyIcon />
              </IconButton>
            </CopyTooltip>
          </div>
        )}
      </div>
      <div className="pl-24 mt-4">
        {text.formula ||
          (text.key && (
            <CopyTooltip
              copyContent="Copy key"
              copiedContent="Key copied"
              stringToCopy={text.key}
            >
              <p className="inline-block text-component">
                {text.formula ? text.formula : text.key}
              </p>
            </CopyTooltip>
          ))}

        {showVariables && Object.keys(text.variables).length > 0 && (
          <Description label="Variables" className="mt-8">
            {Object.keys(text.variables).map((variableName) => (
              <Description label={variableName} horizontal>
                {text.variables[variableName]}
              </Description>
            ))}
          </Description>
        )}
        {!last && <Divider className="mt-16" />}
      </div>
    </div>
  );
};
const DevMain = ({}) => {
  const localeSelection = useLocaleSelection();
  const isReady = useAppSelector((state) => state.localeApp.isReady);
  const [showVariables, setShowVariables] = useState(false);
  const [showAllTexts, setShowAllTexts] = useState(false);
  const textsToShow = showAllTexts
    ? localeSelection.texts
    : localeSelection.texts.filter((text) => text.key);
  return !isReady ? (
    <MainSekeleton />
  ) : (
    <div className="flex flex-col w-full h-screen bg-default">
      <ViewDialog />
      <section className="flex flex-col w-full overflow-y-scroll shrink grow">
        {localeSelection && localeSelection.texts.length ? (
          <div className="flex flex-col gap-16 p-16">
            <header className="flex items-center">
              <h4 className="mt-0 font-medium grow text-secondary">
                {localeSelection.texts.length}{" "}
                {pluralize("text", localeSelection.texts.length)} in selection
              </h4>
              <div className="flex gap-8 shrink-0">
                <Tooltip content="Update texts to latest content">
                  <IconButton onClick={() => {}}>
                    <UpdateIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </header>
            <div className="flex gap-16">
              <Switch
                checked={showAllTexts}
                onCheckedChange={setShowAllTexts}
                label="Show all texts"
                align="left"
              />
              <Switch
                checked={showVariables}
                onCheckedChange={setShowVariables}
                label="Show variables"
                align="left"
              />
            </div>
            <div className="flex flex-col gap-16">
              {textsToShow.map((text, i) => {
                return (
                  <DevText
                    text={text}
                    showVariables={showVariables}
                    last={i == textsToShow.length - 1}
                  ></DevText>
                );
              })}
            </div>
          </div>
        ) : (
          <LocaleItemList />
        )}
      </section>
    </div>
  );
};

export default DevMain;
