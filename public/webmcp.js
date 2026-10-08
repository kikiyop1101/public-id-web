// 퍼블릭아이디 WebMCP (2026-10-08) — 이 페이지를 연 브라우저 에이전트(ChatGPT 데스크톱 'Site tools' 등)가 사이트 검색·마크다운 읽기를 도구로 쓴다.
// 명세 초안(document.modelContext)과 크롬 시험판(navigator.modelContext)을 둘 다 받고, 지원하지 않는 브라우저에서는 아무것도 하지 않는다.
// 도구는 모두 읽기 전용이며 같은 사이트의 공개 주소(/search·Accept: text/markdown·/llms.txt)만 부른다. 보임(boim.io/assets/webmcp.js)과 같은 틀.
(function () {
  var mc = (typeof document !== 'undefined' && document.modelContext) || (typeof navigator !== 'undefined' && navigator.modelContext);
  if (!mc || (typeof mc.registerTool !== 'function' && typeof mc.provideContext !== 'function')) return;
  var text = function (t) { return { content: [{ type: 'text', text: t }] }; };
  var md = function (path) {
    return fetch(path, { headers: { Accept: 'text/markdown' } }).then(function (r) {
      var ct = r.headers.get('content-type') || '';
      if (r.ok && ct.indexOf('text/markdown') === 0) return r.text();
      return fetch('/llms.txt').then(function (x) { return x.text(); }).then(function (t) {
        return '(이 주소는 마크다운 판이 없어 회사 요약을 대신 드립니다)\n\n' + t;
      });
    });
  };
  var ro = function (title) {
    return { title: title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  };
  var tools = [
    {
      name: 'publicid_search_site',
      description: '퍼블릭아이디(주식회사 퍼블릭아이디, 세종 소재 사회적기업·산업디자인전문회사) 홈페이지에서 제품·우리회사OS(AI 업무 자동화 키트)·디자인 구독·소식·질문 답변 페이지를 찾습니다. 예: "스쿨존 노면표시", "노란발자국 가격", "회의록 자동화".',
      inputSchema: { type: 'object', properties: { q: { type: 'string', description: '찾을 말(예: 노란발자국 가격)' } }, required: ['q'], additionalProperties: false },
      annotations: ro('퍼블릭아이디 사이트 검색'),
      execute: function (a) { return md('/search?q=' + encodeURIComponent(String((a && a.q) || '').slice(0, 60))).then(text); },
    },
    {
      name: 'publicid_read_page',
      description: '퍼블릭아이디 홈페이지의 한 페이지를 AI용 마크다운으로 읽습니다(가격은 기준가·부가세 포함). path를 비우면 지금 열린 페이지. 마크다운 판이 있는 곳: /, /products, /os, /os/<킷>, /news/<글>, /answers/<질문>.',
      inputSchema: { type: 'object', properties: { path: { type: 'string', description: '예: /products, /os/minutes (비우면 현재 페이지)' } }, additionalProperties: false },
      annotations: ro('퍼블릭아이디 페이지 읽기'),
      execute: function (a) {
        var p = String((a && a.path) || location.pathname);
        if (p.charAt(0) !== '/') p = '/' + p;
        return md(p.slice(0, 200)).then(text);
      },
    },
    {
      name: 'publicid_company_overview',
      description: '퍼블릭아이디 회사 요약(사업·제품·기준가·인증·연락처)을 llms.txt로 읽습니다.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: ro('퍼블릭아이디 회사 요약'),
      execute: function () { return fetch('/llms.txt').then(function (r) { return r.text(); }).then(text); },
    },
  ];
  try {
    if (typeof mc.registerTool === 'function') tools.forEach(function (t) { Promise.resolve(mc.registerTool(t)).catch(function () {}); });
    else mc.provideContext({ tools: tools });
  } catch { /* 브라우저가 거절하면 그냥 둔다 */ }
})();
