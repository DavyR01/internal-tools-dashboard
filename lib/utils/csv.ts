export function escapeCsv(value: unknown) {
   if (value === null || value === undefined) return "";
   const str = String(value);
   // escape double quotes and wrap in quotes if needed
   if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
   }
   return str;
}

export function toCsv(rows: Array<Array<unknown>>) {
   return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8;") {
   const blob = new Blob([content], { type: mime });
   const url = URL.createObjectURL(blob);

   const a = document.createElement("a");
   a.href = url;
   a.download = filename;
   document.body.appendChild(a);
   a.click();
   a.remove();

   URL.revokeObjectURL(url);
}
