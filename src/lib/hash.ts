import { createHash } from 'node:crypto'

// 익명 게시글 본인확인용 결정적 해시. 강한 보안이 목적이 아니라 작성자 수정/삭제 확인용.
export function hashPassword(pw: string): string {
  const salt = process.env.BOARD_HASH_SALT ?? ''
  return createHash('sha256').update(salt + pw).digest('hex')
}

// 저장된 해시와 입력 비밀번호가 일치하는지
export function verifyOwner(storedHash: string, inputPw: string): boolean {
  return storedHash === hashPassword(inputPw)
}
