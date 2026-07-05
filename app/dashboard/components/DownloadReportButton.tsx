"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult } from "../types";

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
      className="w-full rounded-xl bg-green-600 py-4 font-bold hover:bg-green-700"
    >
      📄 Download PDF Report
    </button>
  );
}