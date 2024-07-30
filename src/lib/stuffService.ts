import { v4 as uuidv4 } from "uuid";

// separate by new line, and add ids
export const parseStuff = (stuff: string) => {
  const split = stuff.split(/\n\s*\n/);
  const res = split.map((s) => ({
    id: uuidv4(),
    content: s.replace(/\r/g, "\n"),
  }));
  return res;
};
