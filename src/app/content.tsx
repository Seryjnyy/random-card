"use client";
import DropZone from "@/components/drop-zone";
import { Button } from "@/components/ui/button";
import { parseStuff } from "@/lib/stuffService";
import { Stuff } from "@/lib/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

function shuffleArray(array: any[]) {
  const cpy = [...array];
  for (var i = cpy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cpy[i];
    cpy[i] = cpy[j];
    cpy[j] = temp;
  }
  return cpy;
}

const ShowingStuff = ({
  stuff,
  onReset,
}: {
  stuff: Stuff[];
  onReset: () => void;
}) => {
  const [localStuff, setLocalStuff] = useState<Stuff[]>(stuff);
  const [index, setIndex] = useState(0);
  useHotkeys("a", () => handlePrev());
  useHotkeys("d", () => handleNext());
  useHotkeys("r", () => handleReshuffle());

  const handleNext = () => {
    if (index >= localStuff.length - 1) return;

    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (index <= 0) return;

    setIndex((prev) => prev - 1);
  };

  const handleReshuffle = () => {
    setLocalStuff((prev) => shuffleArray(prev));

    setIndex(0);
  };

  return (
    <>
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl   p-2 md:p-4 rounded-lg font-bold whitespace-pre-wrap leading-tight">
        {localStuff[index] ? localStuff[index].content : ""}
      </p>

      <div className="flex flex-col justify-center items-center fixed bottom-8">
        {/* <div className="py-2"> */}
        {/* <CountdownTimer amount={Date.now() + 120000} /> */}
        {/* </div> */}
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute -right-10 bottom-7"
          onClick={() => onReset()}
        >
          <ReloadIcon />
        </Button>
        <div className="flex items-center gap-2">
          <div className="space-x-2 border p-1">
            <Button onClick={handlePrev} disabled={index <= 0}>
              <ArrowLeftIcon />
            </Button>
            <Button
              onClick={handleNext}
              disabled={index >= localStuff.length - 1}
            >
              <ArrowRightIcon />
            </Button>
            <Button onClick={handleReshuffle} className="select-none">
              Reshuffle
            </Button>

            {/* {questions[index] ? (
          <NotesModal
            question={questions[index]}
            triggerText="Notes"
            triggerVariant="outline"
          />
        ) : (
          ""
        )} */}
          </div>
          {/* <Button
            variant={"ghost"}
            // onClick={handleHideQuestion}
            className="select-none"
          >
            Hide
          </Button> */}
        </div>
        <span className="text-muted-foreground mt-2 text-xs select-none">
          {`${index + 1}/${localStuff.length}`}
        </span>
      </div>
    </>
  );
};

export default function Content() {
  const [stuff, setStuff] = useState<Stuff[]>([]);

  const resetStuff = () => setStuff([]);
  useHotkeys("ctrl+alt+n", resetStuff);

  const onLoadStuff = (stuff: string) => {
    const res = parseStuff(stuff);
    setStuff(res);
  };

  return (
    <div className="flex flex-col justify-around md:justify-center items-center w-full h-screen gap-24 px-2 md:px-8 relative">
      {stuff.length <= 0 && <DropZone onLoadStuff={onLoadStuff} />}
      {stuff.length > 0 && <ShowingStuff stuff={stuff} onReset={resetStuff} />}
    </div>
  );
}
