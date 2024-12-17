"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { api } from "~/trpc/react";
import { z } from "zod";
import { Input } from "~/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  DropImageIcon,
  EmergencyIcon,
  IsAnalyzingIcon,
  NonEmergencyIcon,
  SpinnerIcon,
  SubmitReportIcon,
} from "../report-icons";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const REPORT_TYPES = [
  "Theft",
  "Fire Outbreak",
  "Medical Emergency",
  "Natural Disaster",
  "Violence",
  "Other",
] as const;

type ReportType = "EMERGENCY" | "NON_EMERGENCY";

const FormSchema = z.object({
  report_title: z.string().min(2, {
    message: "Report title must be at least 2 characters.",
  }),
  report_desc: z.string().min(2, {
    message: "Report description must be at least 2 characters.",
  }),
  incident_type: z.enum(REPORT_TYPES),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  image: z.string().optional(),
});

export function ReportForm() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      report_title: "",
      report_desc: "",
      location: "",
    },
  });

  const { mutate, isPending } = api.report.publicCreateReport.useMutation({
    onSuccess: (res) => {
      router.push(`/track-report/success/${res.r[0]!.id}`);
      form.reset();
      setImage("");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);

    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();
      setImage(base64 as string);

      if (data?.title && data?.description && data?.reportType) {
        form.setValue("report_title", data.title);
        form.setValue("report_desc", data.description);
      }

      console.log("data ->", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({
      title: data.report_title,
      description: data.report_desc,
      reportType: data.incident_type,
      location: data.location,
      image,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setIsEmergency(true)}
            className={cn(
              "rounded-2xl border-2 border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10",
              {
                "border-red-500 bg-red-500/20 shadow-lg shadow-red-500/20":
                  isEmergency,
              },
            )}
          >
            <div className="flex flex-col items-center space-y-2">
              <EmergencyIcon />
              <span className="font-medium text-red-500">Emergency</span>
              <span className="text-xs text-zinc-400">
                Immediate Response Required
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsEmergency(false)}
            className={cn(
              "rounded-2xl border-2 border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10",
              {
                "border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20":
                  !isEmergency,
              },
            )}
          >
            <div className="flex flex-col items-center space-y-2">
              <NonEmergencyIcon />
              <span className="font-medium text-orange-500">Non-Emergency</span>
              <span className="text-xs text-zinc-400">General Report</span>
            </div>
          </button>
        </div>

        <div className="group relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="image-upload"
            className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-zinc-700 p-8 text-center transition-all duration-200 hover:border-sky-500/50 hover:bg-sky-500/5"
          >
            {image ? (
              <div className="space-y-4">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm text-zinc-400">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-4">
                <DropImageIcon />
                <p className="text-sm text-zinc-400">
                  Drop an image here or click to upload
                </p>
              </div>
            )}
          </label>
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
              <div className="flex items-center space-x-3">
                <IsAnalyzingIcon />
                <span className="font-medium text-sky-500">
                  Analyzing image...
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <FormField
            control={form.control}
            name="incident_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-medium text-zinc-400">
                  Incident Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending || isAnalyzing}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40">
                      <SelectValue placeholder="Select a listed report" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REPORT_TYPES.map((type, idx) => (
                      <SelectItem key={idx} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="report_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-medium text-zinc-400">
                  Report Title
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending || isAnalyzing}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-medium text-zinc-400">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending || isAnalyzing}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    placeholder="North Carolina"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="report_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-sm font-medium text-zinc-400">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending || isAnalyzing}
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    placeholder="Please provide a description of the incident."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isAnalyzing}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="relative flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <SpinnerIcon />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Report</span>
                <SubmitReportIcon />
              </>
            )}
          </div>
        </button>
      </form>
    </Form>
  );
}
