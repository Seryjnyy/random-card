"use client";

import DropZone from "@/components/drop-zone";
import { parseStuff } from "@/lib/stuffService";
import { Stuff } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import textSVG from "../../public/text.svg";
import ShowingStuff from "./showing-stuff";
import { RESTART_SHORTCUTS } from "@/lib/shortcuts";

export default function Content() {
  const [stuff, setStuff] = useState<Stuff[]>([]);

  const resetStuff = () => setStuff([]);
  useHotkeys(RESTART_SHORTCUTS, resetStuff);

  const onLoadStuff = (stuff: string) => {
    const res = parseStuff(stuff);
    setStuff(res);
  };

  return (
    <div className="flex flex-col justify-around md:justify-center items-center w-full  gap-24  relative ">
      {stuff.length <= 0 && (
        <div className="space-y-20 h-screen  flex items-center flex-col justify-center relative px-2 md:px-8">
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
