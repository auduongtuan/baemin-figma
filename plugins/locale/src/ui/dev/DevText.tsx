import { useLocaleItems } from "../hooks/locale";
import { CopyIcon, TextIcon } from "@radix-ui/react-icons";
import { Description, Divider, KeyIcon } from "ds";
import { CopyTooltip, IconButton } from "ds";
import { LocaleText, findItemByKey, getTCode } from "../../lib";
import { runCommand } from "@ui/uiHelper";
import { ViewDialogTrigger } from "@ui/locale/dialogs/ViewDialog";
import { useMemo } from "react";

const DevText = ({
  text,
  showVariables = false,
  last = false,
}: {
  text: LocaleText;
  showVariables?: boolean;
  last?: boolean;
}) => {
  const localeItems = useLocaleItems();
  const item = useMemo(
    () => (text.key ? findItemByKey(text.key, localeItems) : null),
    [text.key, localeItems]
  );
  return (
    <div className="group">
      <div className="flex items-center w-full font-normal text-left text-small group">
        <TextIcon className="w-16 h-16 mr-8 text-secondary shrink-0 grow-0" />
        <div
          className="font-medium truncate grow shrink"
          onClick={() => runCommand("set_selection", { id: text.id })}
        >
          {text.characters}
        </div>
        {text.key && (
          <div className="flex gap-12 opacity-0 group-hover:opacity-100 grow-0 shrink-0">
            {item && <ViewDialogTrigger item={item} />}
            <CopyTooltip
              copyContent={text.formula ? "Copy formula" : "Copy key"}
              copiedContent={text.formula ? "Formula copied" : "Key copied"}
              stringToCopy={text.formula || text.key}
            >
              <IconButton>
                <KeyIcon />
              </IconButton>
            </CopyTooltip>
            <CopyTooltip
              copyContent="Copy t code"
              copiedContent="Code copied"
              stringToCopy={getTCode(text, localeItems)}
            >
              <IconButton>
                <CopyIcon />
              </IconButton>
            </CopyTooltip>
          </div>
        )}
      </div>
      <div className="pl-24 mt-4">
        {(text.formula || text.key) && (
          <CopyTooltip
            copyContent={text.formula ? "Copy formula" : "Copy key"}
            copiedContent={text.formula ? "Formula copied" : "Key copied"}
            stringToCopy={text.formula || text.key}
          >
            <p className="inline-block text-component">
              {text.formula ? text.formula : text.key}
            </p>
          </CopyTooltip>
        )}

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

export default DevText;
