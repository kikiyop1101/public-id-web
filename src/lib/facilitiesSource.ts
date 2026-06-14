import type { Facility } from "./facilities";

// 공개 게시된 구글 시트(설치 시설 대장)를 CSV로 읽어 파싱. 서버 전용.
// 대표님이 시트를 수정하면 최대 60초 안에 자동 반영됩니다(재배포 불필요).
const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/1aiLLLyNiofy9n8pPjT8UIFaSgdRXcWTR7wsdm6uWy_Q/export?format=csv&gid=0";

export const SHEET_REVALIDATE = 60;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQ = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export async function loadFacilities(): Promise<Facility[]> {
  const res = await fetch(SHEET_CSV, { next: { revalidate: SHEET_REVALIDATE } });
  if (!res.ok) return [];
  const text = await res.text();
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim());
  const at = (name: string) => header.indexOf(name);
  const col = {
    type: at("종류"),
    client: at("발주처"),
    name: at("명칭/위치"),
    address: at("주소"),
    plannedDate: at("설치예정일"),
    installDate: at("설치일"),
    endDate: at("관리종료일"),
    demolishedDate: at("철거완료일"),
    maintenancePeriod: at("유지보수기간"),
    quantity: at("수량"),
    photo: at("사진URL"),
    note: at("비고"),
  };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");

  return rows
    .slice(1)
    .map((r, i): Facility | null => {
      const type = get(r, col.type);
      const address = get(r, col.address);
      if (!type && !address) return null;
      return {
        id: `s${i}`,
        type,
        client: get(r, col.client),
        name: get(r, col.name) || address,
        address,
        plannedDate: get(r, col.plannedDate) || undefined,
        installDate: get(r, col.installDate),
        endDate: get(r, col.endDate) || undefined,
        demolishedDate: get(r, col.demolishedDate) || undefined,
        maintenancePeriod: get(r, col.maintenancePeriod) || undefined,
        quantity: get(r, col.quantity) || undefined,
        photo: get(r, col.photo) || undefined,
        note: get(r, col.note) || undefined,
      };
    })
    .filter((f): f is Facility => f !== null);
}
