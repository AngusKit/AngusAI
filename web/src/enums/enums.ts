// Node Related Enums
export enum NodeSource {
  OWN_NODE = 'OWN_NODE',
  ONLINE_BUY = 'ONLINE_BUY'
}

export const enumNamespaceMap = new Map<any, string>([
  [NodeSource, 'xcm.enum.NodeSource']
]);
