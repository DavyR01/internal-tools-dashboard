import { escapeCsv, toCsv } from "@/lib/utils/csv";

describe("csv utils", () => {
   test("escapeCsv returns empty string for nullish values", () => {
      expect(escapeCsv(null)).toBe("");
      expect(escapeCsv(undefined)).toBe("");
   });

   test("escapeCsv wraps values containing comma/newline/quotes and escapes quotes", () => {
      expect(escapeCsv("a,b")).toBe('"a,b"');
      expect(escapeCsv("a\nb")).toBe('"a\nb"');
      expect(escapeCsv('He said "hi"')).toBe('"He said ""hi"""');
   });

   test("toCsv joins rows and applies escaping", () => {
      const csv = toCsv([
         ["Name", "Note"],
         ["Slack", 'He said "hi"'],
         ["Notion", "a,b"],
      ]);

      expect(csv).toBe(
         [
            "Name,Note",
            'Slack,"He said ""hi"""',
            'Notion,"a,b"',
         ].join("\n")
      );
   });
});
