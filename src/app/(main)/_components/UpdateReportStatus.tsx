"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function UpdateReportStatus({ id }: { id: string }) {
  const router = useRouter();

  const { mutate } = api.report.updateReport.useMutation({
    onSuccess: (r) => {
      toast.success("Report status updated successfully");
      router.refresh();
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <Select
      onValueChange={(val) =>
        mutate({
          id,
          status: val,
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Update" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Update Status</SelectLabel>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="RESOLVED">Resolved</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="DISMISSED">Dismissed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
