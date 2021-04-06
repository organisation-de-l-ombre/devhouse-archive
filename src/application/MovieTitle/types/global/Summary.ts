interface SummaryItemObject {
  type: "item";
  to: string;
  name: string;
}
interface SummarySubItemsObject {
  type: "subitem";
  to: string;
  name: string;
  items: SummaryItemObject[];
}

type SummaryObject = SummaryItemObject | SummarySubItemsObject;

export { SummaryItemObject, SummarySubItemsObject, SummaryObject };
