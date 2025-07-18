interface Text {
  type: "text";
  name: string;
  id: string;
  text: string;
}
interface TextList {
  type: "textlist";
  name: string;
  id: string;
  texts: string[];
}
interface List {
  type: "list";
  name: string;
  id: string;
  items: string[];
}

interface SubSection {
  type: "subsection";
  name: string;
  id: string;
  body: BodyContent[];
}

type BodyContent = Text | TextList | List | SubSection;

export { Text, TextList, List, SubSection, BodyContent };
