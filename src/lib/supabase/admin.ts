import { createClient } from '@supabase/supabase-js'

// 서버 전용. service_role 키는 RLS를 우회하므로 절대 클라이언트로 노출하지 말 것.
// /admin 서버 라우트·server action 에서만 import.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
