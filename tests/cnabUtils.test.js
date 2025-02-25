import { getBodyLines, filterBySegmentWithLineNumbers, searchCompany } from '../src/cnabUtils.js';

describe("cnabUtils", () => {
  const sampleLines = [
    "HEADER1", 
    "HEADER2",
    "00000000000000ABCDEFGHIJKLMNO12345678901234567890SegmentoX",
    "00000000000000ABCDEFGHIJKLMNO12345678901234567890SegmentoY",
    "TAIL1", 
    "TAIL2"
  ];

  test("getBodyLines remove cabeçalho e rodapé", () => {
    const body = getBodyLines(sampleLines);
    expect(body).toEqual([
      "00000000000000ABCDEFGHIJKLMNO12345678901234567890SegmentoX",
      "00000000000000ABCDEFGHIJKLMNO12345678901234567890SegmentoY"
    ]);
  });

  test("filterBySegmentWithLineNumbers retorna todas se segmento não informado", () => {
    const body = getBodyLines(sampleLines);
    const results = filterBySegmentWithLineNumbers(body, "");
    expect(results.length).toBe(2);
    expect(results[0].originalLineNumber).toBe(3);
  });

  test("searchCompany encontra empresa correta", () => {
    const padded = "0".repeat(32) + "TECNOL Company         " + "XXXXXXXXXXXXXXXXXX";
    const lines = ["HEADER1", "HEADER2", padded, "TAIL1", "TAIL2"];
    const body = getBodyLines(lines);
    const results = searchCompany(body, "TECNOL");
    expect(results.length).toBe(1);
    expect(results[0].companyName).toBe("TECNOL Company");
    expect(results[0].originalLineNumber).toBe(3);
  });
});
