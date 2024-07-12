import stuffList from "@/lib/stuff.json";
import { v4 as uuidv4 } from "uuid";

// const readInStuff = () => {
//   return stuffList.stuff;
// };

// export const getStuff = () => {
//   return readInStuff().map((s) => ({ id: uuidv4(), content: s }));
// };

// separate by new line, and add ids
export const parseStuff = (stuff: string) => {
  //   console.log(stuff);
  //   console.log(newStuff);
  const split = stuff.split(/\n\s*\n/);
  //   const newStuff = stuff.replace(/\r/g, "\n");
  console.log(split);
  const res = split.map((s) => ({
    id: uuidv4(),
    content: s.replace(/\r/g, "\n"),
  }));
  console.log("🚀 ~ parseStuff ~ res:", res);
  return res;
};
