export function createDataBlock() {
  // Create FRAME
  const dataBlock = figma.createFrame();
  dataBlock.name = "i18n Data";
  dataBlock.relativeTransform = [
    [1, 0, 0],
    [0, 1, 128],
  ];
  dataBlock.y = 128;
  dataBlock.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.2549019753932953,
        g: 0.5372549295425415,
        b: 0.8941176533699036,
      },
    },
  ];
  dataBlock.strokeWeight = 2;
  dataBlock.dashPattern = [4, 4];
  dataBlock.cornerRadius = 8;
  dataBlock.paddingLeft = 8;
  dataBlock.paddingRight = 8;
  dataBlock.primaryAxisAlignItems = "CENTER";
  dataBlock.counterAxisAlignItems = "CENTER";
  dataBlock.primaryAxisSizingMode = "FIXED";
  dataBlock.strokeTopWeight = 2;
  dataBlock.strokeBottomWeight = 2;
  dataBlock.strokeLeftWeight = 2;
  dataBlock.strokeRightWeight = 2;
  dataBlock.layoutMode = "VERTICAL";
  dataBlock.itemSpacing = 8;

  // Create FRAME
  const contentFrame = figma.createFrame();
  dataBlock.appendChild(contentFrame);
  contentFrame.resize(84.0, 55.0);
  contentFrame.primaryAxisSizingMode = "AUTO";
  contentFrame.counterAxisSizingMode = "AUTO";
  contentFrame.name = "Content";
  contentFrame.relativeTransform = [
    [1, 0, 8],
    [0, 1, 22.5],
  ];
  contentFrame.x = 8;
  contentFrame.y = 22.5;
  contentFrame.fills = [];
  contentFrame.paddingBottom = 12;
  contentFrame.counterAxisAlignItems = "CENTER";
  contentFrame.strokeTopWeight = 1;
  contentFrame.strokeBottomWeight = 1;
  contentFrame.strokeLeftWeight = 1;
  contentFrame.strokeRightWeight = 1;
  contentFrame.clipsContent = false;
  contentFrame.layoutMode = "VERTICAL";
  contentFrame.counterAxisSizingMode = "AUTO";
  contentFrame.itemSpacing = 6;

  // Create FRAME
  const iconFrame = figma.createFrame();
  contentFrame.appendChild(iconFrame);
  iconFrame.resize(24.0, 24.0);
  iconFrame.primaryAxisSizingMode = "AUTO";
  iconFrame.name = "Icon";
  iconFrame.relativeTransform = [
    [1, 0, 30],
    [0, 1, 0],
  ];
  iconFrame.x = 30;
  iconFrame.fills = [
    {
      type: "SOLID",
      visible: false,
      opacity: 1,
      blendMode: "NORMAL",
      color: { r: 1, g: 1, b: 1 },
    },
  ];
  iconFrame.strokeTopWeight = 1;
  iconFrame.strokeBottomWeight = 1;
  iconFrame.strokeLeftWeight = 1;
  iconFrame.strokeRightWeight = 1;

  // Create VECTOR
  const iconVector1 = figma.createVector();
  iconFrame.appendChild(iconVector1);
  iconVector1.resize(20.0, 20.0);
  iconVector1.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.2549019753932953,
        g: 0.5372549295425415,
        b: 0.8941176533699036,
      },
    },
  ];
  iconVector1.strokeWeight = 2;
  iconVector1.strokeJoin = "ROUND";
  iconVector1.strokeCap = "ROUND";
  iconVector1.relativeTransform = [
    [1, 0, 2],
    [0, 1, 2],
  ];
  iconVector1.x = 2;
  iconVector1.y = 2;
  iconVector1.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  iconVector1.vectorNetwork = {
    regions: [],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 5.522847652435303 },
        tangentEnd: { x: 5.522847652435303, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: -5.522847652435303, y: 0 },
        tangentEnd: { x: 0, y: 5.522847652435303 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0, y: -5.522847652435303 },
        tangentEnd: { x: -5.522847652435303, y: 0 },
      },
      {
        start: 3,
        end: 0,
        tangentStart: { x: 5.522847652435303, y: 0 },
        tangentEnd: { x: 0, y: -5.522847652435303 },
      },
    ],
    vertices: [
      {
        x: 20,
        y: 10,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 10,
        y: 20,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 10,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 10,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  iconVector1.vectorPaths = [
    {
      windingRule: "NONE",
      data: "M 20 10 C 20 15.522847652435303 15.522847652435303 20 10 20 C 4.477152347564697 20 0 15.522847652435303 0 10 C 0 4.477152347564697 4.477152347564697 0 10 0 C 15.522847652435303 0 20 4.477152347564697 20 10 Z",
    },
  ];

  // Create VECTOR
  const iconVector2 = figma.createVector();
  iconFrame.appendChild(iconVector2);
  iconVector2.resizeWithoutConstraints(20.0, 0.0);
  iconVector2.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.2549019753932953,
        g: 0.5372549295425415,
        b: 0.8941176533699036,
      },
    },
  ];
  iconVector2.strokeWeight = 2;
  iconVector2.strokeJoin = "ROUND";
  iconVector2.strokeCap = "ROUND";
  iconVector2.relativeTransform = [
    [1, 0, 2],
    [0, 1, 12],
  ];
  iconVector2.x = 2;
  iconVector2.y = 12;
  iconVector2.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  iconVector2.vectorNetwork = {
    regions: [],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 0,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 20,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  iconVector2.vectorPaths = [{ windingRule: "NONE", data: "M 0 0 L 20 0" }];

  // Create VECTOR
  const iconVector3 = figma.createVector();
  iconFrame.appendChild(iconVector3);
  iconVector3.resize(8.0, 20.0);
  iconVector3.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.2549019753932953,
        g: 0.5372549295425415,
        b: 0.8941176533699036,
      },
    },
  ];
  iconVector3.strokeWeight = 2;
  iconVector3.strokeJoin = "ROUND";
  iconVector3.strokeCap = "ROUND";
  iconVector3.relativeTransform = [
    [1, 0, 8],
    [0, 1, 2],
  ];
  iconVector3.x = 8;
  iconVector3.y = 2;
  iconVector3.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  iconVector3.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3]],
        fills: [],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 2.5012803077697754, y: 2.7383527755737305 },
        tangentEnd: { x: -0.0772472396492958, y: -3.7079660892486572 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: -0.0772472396492958, y: 3.7079660892486572 },
        tangentEnd: { x: 2.5012803077697754, y: -2.7383527755737305 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: -2.5012803077697754, y: -2.7383527755737305 },
        tangentEnd: { x: 0.0772472396492958, y: 3.7079660892486572 },
      },
      {
        start: 3,
        end: 0,
        tangentStart: { x: 0.0772472396492958, y: -3.7079660892486572 },
        tangentEnd: { x: -2.5012803077697754, y: 2.7383527755737305 },
      },
    ],
    vertices: [
      {
        x: 4,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 8,
        y: 10,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 4,
        y: 20,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 10,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  iconVector3.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 4 0 C 6.501280307769775 2.7383527755737305 7.922752760350704 6.292033910751343 8 10 C 7.922752760350704 13.707966089248657 6.501280307769775 17.26164722442627 4 20 C 1.4987196922302246 17.26164722442627 0.0772472396492958 13.707966089248657 0 10 C 0.0772472396492958 6.292033910751343 1.4987196922302246 2.7383527755737305 4 0 Z",
    },
  ];

  // Create TEXT
  const nameText = figma.createText();
  contentFrame.appendChild(nameText);
  nameText.resize(84.0, 15.0);
  nameText.name = "Name";
  nameText.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.13333334028720856,
        g: 0.13333334028720856,
        b: 0.13333334028720856,
      },
    },
  ];
  nameText.relativeTransform = [
    [1, 0, 0],
    [0, 1, 32],
  ];
  nameText.y = 32;
  nameText.autoRename = false;

  // Font properties
  nameText.fontName = {
    family: "Roboto Mono",
    style: "Bold",
  };
  nameText.fontSize = 12;
  nameText.lineHeight = {
    value: 14,
    unit: "PIXELS",
  };
  nameText.textAutoResize = "HEIGHT";
  nameText.characters = "i18n Data";
  nameText.textAlignHorizontal = "CENTER";

  // Create FRAME
  const warningFrame = figma.createFrame();
  dataBlock.appendChild(warningFrame);
  warningFrame.resize(76.0, 10.0);
  warningFrame.primaryAxisSizingMode = "AUTO";
  warningFrame.counterAxisSizingMode = "AUTO";
  warningFrame.name = "Warning";
  warningFrame.relativeTransform = [
    [1, 0, 12.5],
    [0, 1, 84],
  ];
  warningFrame.layoutPositioning = "ABSOLUTE";
  warningFrame.x = 12.5;
  warningFrame.y = 84;
  warningFrame.fills = [];
  warningFrame.counterAxisAlignItems = "CENTER";
  warningFrame.strokeTopWeight = 1;
  warningFrame.strokeBottomWeight = 1;
  warningFrame.strokeLeftWeight = 1;
  warningFrame.strokeRightWeight = 1;
  warningFrame.clipsContent = false;
  warningFrame.constraints = { horizontal: "CENTER", vertical: "MIN" };
  warningFrame.layoutMode = "HORIZONTAL";
  warningFrame.counterAxisSizingMode = "AUTO";
  warningFrame.itemSpacing = 4;

  // Create FRAME
  const warningIconFrame = figma.createFrame();
  warningFrame.appendChild(warningIconFrame);
  warningIconFrame.resize(8.0, 8.0);
  warningIconFrame.primaryAxisSizingMode = "AUTO";
  warningIconFrame.name = "Warning Icon";
  warningIconFrame.relativeTransform = [
    [1, 0, 0],
    [0, 1, 1],
  ];
  warningIconFrame.y = 1;
  warningIconFrame.fills = [
    {
      type: "SOLID",
      visible: false,
      opacity: 1,
      blendMode: "NORMAL",
      color: { r: 1, g: 1, b: 1 },
    },
  ];
  warningIconFrame.strokeWeight = 0.3333333432674408;
  warningIconFrame.strokeTopWeight = 0.3333333432674408;
  warningIconFrame.strokeBottomWeight = 0.3333333432674408;
  warningIconFrame.strokeLeftWeight = 0.3333333432674408;
  warningIconFrame.strokeRightWeight = 0.3333333432674408;

  // Create VECTOR
  const warningIconVector1 = figma.createVector();
  warningIconFrame.appendChild(warningIconVector1);
  warningIconVector1.resize(6.6666665077, 6.6666665077);
  warningIconVector1.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.8791666626930237,
        g: 0.23078125715255737,
        b: 0.23078125715255737,
      },
    },
  ];
  warningIconVector1.strokeWeight = 0.6666666865348816;
  warningIconVector1.strokeJoin = "ROUND";
  warningIconVector1.strokeCap = "ROUND";
  warningIconVector1.relativeTransform = [
    [1, 0, 0.6666668057],
    [0, 1, 0.6666668057],
  ];
  warningIconVector1.x = 0.6666668057441711;
  warningIconVector1.y = 0.6666668057441711;
  warningIconVector1.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  warningIconVector1.vectorNetwork = {
    regions: [],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 1.8409491735867847 },
        tangentEnd: { x: 1.8409491735867847, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: -1.8409491735867847, y: 0 },
        tangentEnd: { x: 0, y: 1.8409491735867847 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0, y: -1.8409491735867847 },
        tangentEnd: { x: -1.8409491735867847, y: 0 },
      },
      {
        start: 3,
        end: 0,
        tangentStart: { x: 1.8409491735867847, y: 0 },
        tangentEnd: { x: 0, y: -1.8409491735867847 },
      },
    ],
    vertices: [
      {
        x: 6.666666507720947,
        y: 3.3333332538604736,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 3.3333332538604736,
        y: 6.666666507720947,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 3.3333332538604736,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 3.3333332538604736,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  warningIconVector1.vectorPaths = [
    {
      windingRule: "NONE",
      data: "M 6.666666507720947 3.3333332538604736 C 6.666666507720947 5.174282427447258 5.174282427447258 6.666666507720947 3.3333332538604736 6.666666507720947 C 1.492384080273689 6.666666507720947 0 5.174282427447258 0 3.3333332538604736 C 0 1.492384080273689 1.492384080273689 0 3.3333332538604736 0 C 5.174282427447258 0 6.666666507720947 1.492384080273689 6.666666507720947 3.3333332538604736 Z",
    },
  ];

  // Create VECTOR
  const warningIconVector2 = figma.createVector();
  warningIconFrame.appendChild(warningIconVector2);
  warningIconVector2.resize(4.7133331299, 4.7133331299);
  warningIconVector2.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.8791666626930237,
        g: 0.23078125715255737,
        b: 0.23078125715255737,
      },
    },
  ];
  warningIconVector2.strokeWeight = 0.6666666865348816;
  warningIconVector2.strokeJoin = "ROUND";
  warningIconVector2.strokeCap = "ROUND";
  warningIconVector2.relativeTransform = [
    [1, 0, 1.6433334351],
    [0, 1, 1.6433334351],
  ];
  warningIconVector2.x = 1.6433334350585938;
  warningIconVector2.y = 1.6433334350585938;
  warningIconVector2.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  warningIconVector2.vectorNetwork = {
    regions: [],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 0,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 4.7133331298828125,
        y: 4.7133331298828125,
        strokeCap: "ROUND",
        strokeJoin: "ROUND",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  warningIconVector2.vectorPaths = [
    {
      windingRule: "NONE",
      data: "M 0 0 L 4.7133331298828125 4.7133331298828125",
    },
  ];

  // Create TEXT
  const warningText = figma.createText();
  warningFrame.appendChild(warningText);
  warningText.resize(64.0, 10.0);
  warningText.name = "DO NOT DELETE";
  warningText.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.8791666626930237,
        g: 0.23078125715255737,
        b: 0.23078125715255737,
      },
    },
  ];
  warningText.relativeTransform = [
    [1, 0, 12],
    [0, 1, 0],
  ];
  warningText.x = 12;

  warningText.fontName = { family: "Roboto Mono", style: "Regular" };
  warningText.fontSize = 8;
  warningText.textAlignHorizontal = "CENTER";
  warningText.lineHeight = {
    value: 10,
    unit: "PIXELS",
  };
  warningText.textAutoResize = "WIDTH_AND_HEIGHT";
  warningText.characters = "DO NOT DELETE";
  return dataBlock;
}
