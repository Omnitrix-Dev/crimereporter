"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function ReportsFilter() {
  const router = useRouter();
  const [status, setStatus] = useQueryState("status");
  const [types, setTypes] = useQueryState("types");

  return (
    <div className="flex gap-4">
      <Select
        onValueChange={async (val) => {
          setStatus(val);
          await new Promise((resolve) => setTimeout(resolve, 800));
          router.refresh();
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        onValueChange={async (val) => {
          setTypes(val);
          await new Promise((resolve) => setTimeout(resolve, 800));
          router.refresh();
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a types" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Types</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="non_emergency">Non Emergency</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {!!status && !!types && (
        <Button
          onClick={() => router.push("/dashboard")}
          variant="destructive"
          size="icon"
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
