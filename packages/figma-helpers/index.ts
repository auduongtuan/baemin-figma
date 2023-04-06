import * as _ from "lodash";
// import bootstrapComponents from "../data/bootstrapComponents";

export const getVariantInSet = (componentSet: ComponentSetNode, variantProperties: { [key:string]: string}):ComponentNode|null => {
	const component = <ComponentNode|null>componentSet.findChild(node => {
		return node.type == "COMPONENT" && _.isEqual(node.variantProperties, {...componentSet.defaultVariant.variantProperties, ...variantProperties});
	});
	if (component) return component;
	return null;
}	

export const swapVariant = (instance: InstanceNode, changedVariantProperties: { [key:string]: string} ) => {
	if (instance.mainComponent.parent) {
		const swapedComponent = instance.mainComponent.parent.findChild(node => {
			return node.type == "COMPONENT" && _.isEqual(node.variantProperties, {...instance.mainComponent.variantProperties, ...changedVariantProperties})
		});
		if (!swapedComponent) {
			console.log("component not found");
			return false;
		}
		if (swapedComponent && swapedComponent.type == "COMPONENT") {
			// && instance.mainComponent.id != swapedComponent.id
			instance.swapComponent(swapedComponent);
			return true;
		}
	}
}

export const isVariant = (node: BaseNode, componentName: string, variantProperties: {[key: string]: string} = {}): node is InstanceNode => {
	return node.type == "INSTANCE" && node.mainComponent.parent && node.mainComponent.parent.type == "COMPONENT_SET" && node.mainComponent.parent.name == componentName && _.isMatch(node.mainComponent.variantProperties, variantProperties);
}
// return main component if not variant, return parent of main component if is variant
export const getComponent = (node: InstanceNode): ComponentNode | ComponentSetNode => {
	if (node.mainComponent.parent && node.mainComponent.parent.type == "COMPONENT_SET") return node.mainComponent.parent;
	return node.mainComponent;
}

// export const getData = (node: SceneNode, key: string) => {
// 	return node.getSharedPluginData('aperia', key);
// }

// export const setData = (node: SceneNode, key: string, value: string) => {
// 	node.setSharedPluginData('aperia', key, value);
// }

export const getDS = (node: SceneNode): 'bootstrap' | 'pixel' | string => {
	return node.getSharedPluginData('aperia', 'ds');
}

export const isDS = (node: SceneNode, name: 'bootstrap' | 'pixel') => {
	return getDS(node) == name;
}

export function selection(): SceneNode[];
export function selection(index: number): SceneNode | undefined;
export function selection(index?: number) {
	const s = figma.currentPage.selection.slice();
	if (typeof index !== 'undefined') {
		if (s && s.length > 0 && s[index]) return s[index];
		return undefined;
	} else {
		return s;
	}

}



export const postData = (data: {[key: string]: any}) => {
	if (figma.ui) figma.ui.postMessage(data);
}

export const isText = (node: BaseNode): node is TextNode => {
	return node && node.type == "TEXT"
}

export const isFrame = (node: BaseNode): node is FrameNode => {
	return node && node.type == "FRAME"
}

export const isComponent = (node: BaseNode): node is ComponentNode => {
	return node && node.type == "COMPONENT"
}

export const isInstance = (node: BaseNode, componentName: string | null = null): node is InstanceNode => {
	// if (componentName && bootstrapComponents[componentName])
	// {
	// 	return node && node.type == "INSTANCE" && node.mainComponent.key == bootstrapComponents[componentName].key;
	// }
	if (componentName) {
		return node && node.type == "INSTANCE" && ((node.mainComponent && node.mainComponent.name == componentName) || (node.mainComponent.parent && node.mainComponent.parent.name == componentName));
	}
	else {
		return node && node.type == "INSTANCE"
	}
}

export type ContainerNode = InstanceNode | FrameNode | GroupNode | ComponentNode;
export const isContainer = (node:BaseNode): node is ContainerNode  => {
	return node.type == "INSTANCE" || node.type == "FRAME" || node.type == "GROUP" || node.type == "COMPONENT";
}

export const findContainer = (parentContainer: ContainerNode, containerName: string) : ContainerNode | null => {
	return <ContainerNode | null>parentContainer.findOne(node => isContainer(node) && node.name == containerName);
}

export const loadRobotoFontsAsync = async (family: 'Sans' | 'Mono' = null, weight: 'Regular' | 'Medium' | 'SemiBold' | 'Bold' = null) => {
	if(family == 'Sans' || !family) {
		if(weight == 'Regular' || !weight) await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
		if(weight == 'Medium' || !weight) await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
		if(weight == 'SemiBold' || !weight) await figma.loadFontAsync({ family: "Roboto", style: "SemiBold" });
		if(weight == 'Bold' || !weight) await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
	}
	if(family == 'Mono' || !family) {
		if(weight == 'Regular' || !weight) await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
		if(weight == 'Medium' || !weight) await figma.loadFontAsync({ family: "Roboto Mono", style: "Medium" });
		if(weight == 'SemiBold' || !weight) await figma.loadFontAsync({ family: "Roboto Mono", style: "SemiBold" });
		if(weight == 'Bold' || !weight) await figma.loadFontAsync({ family: "Roboto Mono", style: "Bold" });
	}


}
export const loadFontsAsync = async (node: TextNode) => {
	if(node && node.characters) {
		const fonts = node.getRangeAllFontNames(0, node.characters.length);
		for (const font of fonts) {
			await figma.loadFontAsync(font);
		}
	}
}
export const getLocalPaintStyle = (name: string) => {
	return figma.getLocalPaintStyles().filter(paint => paint.name == name)[0];
}
export const getNodeData = (node: BaseNode, name: string) => {
	return node.getSharedPluginData('BAEMIN', name);
}
export const setNodeData = (node: BaseNode, name: string, value: string) => {
	return node.setSharedPluginData('BAEMIN', name, value);
}
