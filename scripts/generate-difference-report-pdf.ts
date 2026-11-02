import fs from "node:fs";
import path from "node:path";
import {
  buildDifferenceReportPdf,
  DIFFERENCE_REPORT_FILENAME,
} from "../src/lib/difference-report-pdf.ts";

const doc = buildDifferenceReportPdf();
const arrayBuffer = doc.output("arraybuffer");
const buffer = Buffer.from(arrayBuffer);

const outputPaths = [
  path.resolve(process.cwd(), DIFFERENCE_REPORT_FILENAME),
  path.resolve(process.cwd(), "public", DIFFERENCE_REPORT_FILENAME),
  path.resolve(process.cwd(), "flightloggerreatask", DIFFERENCE_REPORT_FILENAME),
];

for (const outPath of outputPaths) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(
    `[PDF Generated] ${outPath} (${buffer.byteLength.toLocaleString()} bytes, ${doc.getNumberOfPages()} pages)`
  );
}
