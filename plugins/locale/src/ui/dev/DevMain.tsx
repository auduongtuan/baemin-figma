import { useAppSelector } from "@ui/hooks/redux";
import { useLocaleSelection } from "../hooks/locale";
import MainSekeleton from "../locale/atoms/MainSkeleton";
import { Switch } from "ds";
import LocaleItemList from "@ui/locale/items/LocaleItemList";
import ViewDialog from "@ui/locale/dialogs/ViewDialog";
import { pluralize } from "@capaj/pluralize";
import { useMemo, useState } from "react";
import DevText from "./DevText";

const DevMain = ({}) => {
  const localeSelection = useLocaleSelection();
  const isReady = useAppSelector((state) => state.localeApp.isReady);
  const [showVariables, setShowVariables] = useState(false);
  const [showAllTexts, setShowAllTexts] = useState(false);
  const textsToShow = useMemo(
    () =>
      showAllTexts
        ? localeSelection.texts
        : localeSelection.texts.filter((text) => text.key),
    [showAllTexts, localeSelection.texts]
  );
  return !isReady ? (
    <MainSekeleton />
  ) : (
    <div className="flex flex-col w-full h-screen bg-default">
      <ViewDialog />
      <section className="flex flex-col w-full overflow-y-scroll shrink grow">
        {localeSelection && localeSelection.texts.length ? (
          <div className="flex flex-col gap-24 p-16">
            <div className="space-y-8">
              <header className="flex items-center">
                <h4 className="mt-0 font-medium grow text-secondary">
                  {textsToShow.length} {showAllTexts ? "" : " localized "}
                  {pluralize("text", textsToShow.length)} in selection
                </h4>
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
