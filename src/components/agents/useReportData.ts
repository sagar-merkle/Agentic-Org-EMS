"use client";
import { useMemo } from "react";
import { REPORTS, type ReportData } from "@/components/agents/reportDefs";
import { useStore } from "@/lib/store";
import { CALLS } from "@/lib/seed";
import { FEEDBACK } from "@/lib/seedService";

export function useReportData(): ReportData {
  const s = useStore();
  return useMemo(
    () => ({ enquiries: s.enquiries, bookings: s.bookings, tasks: s.tasks, jobs: s.jobs, claims: s.claims, vehicles: s.vehicles, feedback: FEEDBACK, calls: CALLS }),
    [s.enquiries, s.bookings, s.tasks, s.jobs, s.claims, s.vehicles],
  );
}
export { REPORTS };

