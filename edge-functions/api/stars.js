// EdgeOne Pages 边缘函数:寿星名单存取(Blob 存储)
// GET  /api/stars → {"birthdayStar":[...]}
// POST /api/stars ← {"birthdayStar":[...]} 保存并返回去重后的名单
import { getStore } from "@edgeone/pages-blob";

// 强一致读取:保存后所有设备立即读到最新名单
const store = getStore({ name: "birthday-card", consistency: "strong" });
const KEY = "stars.json";
// Blob 里还没有数据时的初始名单(打包时注入)
const DEFAULT = ["董家鳞","王矿辉"];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function onRequest({ request }) {
  if (request.method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "请求体不是 JSON" }, 400);
    }
    const raw = body && typeof body === "object" ? body.birthdayStar : null;
    if (!Array.isArray(raw)) {
      return json({ ok: false, error: "格式错误" }, 400);
    }
    const list = [...new Set(
      raw.filter((x) => typeof x === "string" && x.trim() !== "").map((x) => x.trim()),
    )];
    try {
      await store.setJSON(KEY, { birthdayStar: list });
    } catch {
      return json({ ok: false, error: "写入 Blob 失败" }, 500);
    }
    return json({ ok: true, birthdayStar: list });
  }

  // GET:优先读 Blob,没有则返回内置初始名单
  try {
    const data = await store.get(KEY, { type: "json" });
    if (data && Array.isArray(data.birthdayStar)) {
      return json({ birthdayStar: data.birthdayStar });
    }
  } catch { /* 读取失败时使用默认名单 */ }
  return json({ birthdayStar: DEFAULT });
}
