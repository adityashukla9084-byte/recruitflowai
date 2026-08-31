"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult } from "../types";
import { Download } from "lucide-react";

type Props = {
  result: AnalysisResult;
};

export default function DownloadReportButton({ result }: Props) {
  function downloadPDF() {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("RecruitFlow AI Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`ATS Score: ${result.atsScore}%`, 14, 35);
    doc.text(`Job Match: ${result.jobMatchScore}%`, 14, 43);
    doc.text(`Salary: ${result.salaryRange}`, 14, 51);

    autoTable(doc, {
      startY: 60,
      head: [["Section", "Details"]],
      body: [
        ["Summary", result.summary],
        ["Recruiter Feedback", result.recruiterFeedback],
        ["Strengths", result.strengths.join(", ")],
        ["Weaknesses", result.weaknesses.join(", ")],
        ["Matched Keywords", result.matchedKeywords.join(", ")],
        ["Missing Keywords", result.missingKeywords.join(", ")],
        ["Suggestions", result.suggestions.join(", ")],
      ],
    });

    doc.save("RecruitFlowAI_Report.pdf");
  }

  return (
    <button
      onClick={downloadPDF}
      className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-200 hover:scale-[1.005] active:scale-[0.995] bg-theme-text text-theme-bg shadow-md hover:shadow-lg hover:opacity-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 border border-black/10 dark:border-theme-border"
    >
      <Download size={14} strokeWidth={2} aria-hidden="true" />
      Download PDF Report
    </button>
  );
}