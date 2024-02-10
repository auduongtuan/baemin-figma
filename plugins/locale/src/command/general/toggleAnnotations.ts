import { pluralize } from "@capaj/pluralize";
import { setNodeData } from "figma-helpers";

const toggleAnnotations = async () => {
  const currentPage = figma.currentPage;
  let annotationGroups: GroupNode[] = [];
  // wait for time when all annotations are updated
  // annotationGroups = currentPage.findAllWithCriteria({
  //   types: ["GROUP"],
  //   sharedPluginData: {
  //     namespace: "BAEMIN",
  //     keys: ["i18n_annotation"],
  //   },
  // });
  if (annotationGroups.length == 0) {
    const legacyAnnotationGroups = currentPage.findAllWithCriteria({
      types: ["GROUP"],
    });
    annotationGroups = legacyAnnotationGroups.filter((group) => {
      return group.name.includes("i18n annotation");
    });
    // update legacy annotation groups
    annotationGroups.forEach((group) =>
      setNodeData(group, "i18n_annotation", "1")
    );
  }
  if (annotationGroups.length > 0) {
    const newVisible = !annotationGroups[0].visible;
    annotationGroups.forEach((group) => {
      group.visible = newVisible;
    });
  }
  figma.notify(
    annotationGroups.length +
      " " +
      pluralize("annotations", annotationGroups.length) +
      " toggled"
  );
};

export default toggleAnnotations;
