"use client";
import textSVG from "../../public/text.svg";
import Image from "next/image";
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
      <div className="flex items-center justify-center bg-blue-200 h-fit">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-clip p-2 pb-32 md:p-4 md:pb-32  rounded-lg font-bold whitespace-pre-wrap leading-tight">
          {localStuff[index] ? localStuff[index].content : ""}
        </p>
      </div>

      <div className="flex flex-col justify-center items-center fixed bottom-8 ">
        {/* <div className="py-2"> */}
        {/* <CountdownTimer amount={Date.now() + 120000} /> */}
        {/* </div> */}
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute -right-10 bottom-7 backdrop-blur-sm"
          onClick={() => onReset()}
        >
          <ReloadIcon />
        </Button>
        <div className="flex items-center gap-2">
          <div className="space-x-2 border p-1 backdrop-blur-sm">
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
        <div className="text-muted-foreground mt-2 text-xs select-none backdrop-blur-sm p-2">
          {`${index + 1}/${localStuff.length}`}
        </div>
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
      {stuff.length <= 0 && (
        <div className="space-y-20">
          <div className="flex flex-col justify-center  items-center gap-2">
            <Image
              priority
              src={textSVG}
              alt="Content is split by new empty lines."
              className="motion-safe:animate-[pulse_2s_ease-in-out_infinite] border w-28 h-28"
            />
            <p className="text-muted-foreground w-[20rem] text-xs  text-balance text-center">
              Ensure your content is separated by a new empty line; otherwise,
              it will be grouped together into one card.
            </p>
          </div>
          <DropZone onLoadStuff={onLoadStuff} />
        </div>
      )}
      {stuff.length > 0 && <ShowingStuff stuff={stuff} onReset={resetStuff} />}
    </div>
  );
}
