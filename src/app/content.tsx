"use client";
import { Key } from "ts-key-enum";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

const PREV_SHORTCUTS = ["a"];
const NEXT_SHORTCUTS = ["d"];
const RESHUFFLE_SHORTCUTS = ["r"];
const RESTART_SHORTCUTS = ["ctrl+alt+n"];

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

const Shortcut = ({ shortcut }: { shortcut: string }) => {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      <span className="text-xs">⌘</span>
      {shortcut}
    </kbd>
  );
};

const ShowingStuff = ({
  stuff,
  onReset,
}: {
  stuff: Stuff[];
  onReset: () => void;
}) => {
  const [localStuff, setLocalStuff] = useState<Stuff[]>(stuff);
  const [index, setIndex] = useState(0);
  useHotkeys([...PREV_SHORTCUTS, Key.ArrowLeft], () => handlePrev());
  useHotkeys([...NEXT_SHORTCUTS, Key.ArrowRight], () => handleNext());
  useHotkeys(RESHUFFLE_SHORTCUTS, () => handleReshuffle());

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
      <div className="flex items-center justify-center min-h-screen ">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  p-2 pb-32 md:p-4 md:pb-32  rounded-lg font-bold whitespace-pre-wrap leading-tight  ">
          {localStuff[index] ? localStuff[index].content : ""}
        </p>
      </div>

      <div className="flex flex-col justify-center items-center fixed bottom-8 ">
        <div className="absolute -right-10 bottom-12  space-x-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="backdrop-blur-sm"
                  onClick={() => onReset()}
                >
                  <ReloadIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="space-x-2">
                  <span>Restart</span>
                  <Shortcut shortcut="ctrl+alt+n" />
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ThemeModeToggle />
              </TooltipTrigger>
              <TooltipContent>
                <p className="space-x-2">
                  <span>Change theme</span>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="space-x-2 border p-1 backdrop-blur-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button onClick={handlePrev} disabled={index <= 0}>
                    <ArrowLeftIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="space-x-2">
                    <span>Go back</span>
                    <Shortcut shortcut="a, ←" />
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleNext}
                    disabled={index >= localStuff.length - 1}
                  >
                    <ArrowRightIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="space-x-2">
                    <span>Go forward</span>
                    <Shortcut shortcut="d, →" />
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button onClick={handleReshuffle} className="select-none">
                    Reshuffle
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="space-x-2">
                    <span>Change the order</span>
                    <Shortcut shortcut="r" />
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
  const [stuff, setStuff] = useState<Stuff[]>([{ id: "s", content: "s" }]);

  const resetStuff = () => setStuff([]);
  useHotkeys(RESTART_SHORTCUTS, resetStuff);

  const onLoadStuff = (stuff: string) => {
    const res = parseStuff(stuff);
    setStuff(res);
  };

  return (
    <div className="flex flex-col justify-around md:justify-center items-center w-full  gap-24 px-2 md:px-8 relative ">
      {stuff.length <= 0 && (
        <div className="space-y-20 h-screen  flex items-center flex-col justify-center relative">
          <div className="flex flex-col  justify-center  items-center gap-2 ">
            <Image
              priority
              src={textSVG}
              alt="Content is split by new empty lines."
              className="motion-safe:animate-[pulse_2s_ease-in-out_infinite] border w-28 h-28 rounded-lg "
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
