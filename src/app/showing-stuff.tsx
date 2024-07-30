"use client";
import { Key } from "ts-key-enum";

import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Stuff } from "@/lib/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { shuffleArray } from "@/lib/utils";
import {
  NEXT_SHORTCUTS,
  PREV_SHORTCUTS,
  RESHUFFLE_SHORTCUTS,
} from "@/lib/shortcuts";

const Shortcut = ({ shortcut }: { shortcut: string }) => {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      <span className="text-xs">⌘</span>
      {shortcut}
    </kbd>
  );
};

export default function ShowingStuff({
  stuff,
  onReset,
}: {
  stuff: Stuff[];
  onReset: () => void;
}) {
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

  const handleReset = () => {
    onReset();
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full relative">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  p-2 pb-32 md:p-4 md:pb-32 px-2 md:px-8  rounded-lg font-bold whitespace-pre-wrap leading-tight  ">
          {localStuff[index] ? localStuff[index].content : ""}
        </p>
        <div className="h-full w-full  absolute flex ">
          <div
            className="h-full w-1/2 cursor-pointer"
            onClick={handlePrev}
          ></div>
          <div
            className="h-full w-1/2 cursor-pointer"
            onClick={handleNext}
          ></div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center fixed bottom-8 z-50">
        <div className="absolute -right-10 bottom-12  space-x-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="backdrop-blur-sm"
                  onClick={handleReset}
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
          </div>
        </div>
        <div className="text-muted-foreground mt-2 text-xs select-none backdrop-blur-sm p-2">
          {`${index + 1}/${localStuff.length}`}
        </div>
      </div>
    </>
  );
}
