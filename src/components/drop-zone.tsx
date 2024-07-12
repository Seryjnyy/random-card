import { Stuff } from "@/lib/types";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "./ui/use-toast";
// import { toast } from "../use-toast";
// import { useNoteStore } from "@repo/lib/note-store";
// import { Note } from "@repo/lib/types";
// import { guidGenerator } from "@repo/lib/metadata-utils";
// import { usePreferenceStore } from "@repo/lib/preference-store";
// import { sortNotes } from "@repo/lib/note-sorting";

export default function DropZone({
  onLoadStuff,
}: {
  onLoadStuff: (stuffs: string) => void;
}) {
  // const setNotes = useNoteStore((state) => state.setNotes);
  // const settings = usePreferenceStore((state) => state.settings);

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type != "text/plain") {
        console.log("wrong type");
        toast({
          variant: "destructive",
          title: "Wrong type of file provided",
          description: `Only text/plain files allowed, you added a ${file.type}.`,
        });
        continue;
      }

      const txt = await file.text();
      onLoadStuff(txt);
      return txt;
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "text/plain": [".txt"],
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="border p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-lg"
      >
        <input {...getInputProps()} className="border" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p className="whitespace-pre-wrap text-center">
            {
              "Drag 'n' drop a txt file here \n or \n Click to select a txt file"
            }
          </p>
        )}
      </div>
    </>
  );
}
