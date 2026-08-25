'use client'

import { useActionState, useState } from 'react'
import { createBoardComment, type CommentFormState } from './actions'

export type CommentNode = {
  id: string
  nickname: string
  body: string
  children: CommentNode[]
}

const initial: CommentFormState = {}

function CommentForm({
  postId,
  parentId,
  onDone,
  autoFocus,
}: {
  postId: string
  parentId?: string
  onDone?: () => void
  autoFocus?: boolean
}) {
  const action = createBoardComment.bind(null, postId)
  const [state, formAction, pending] = useActionState(action, initial)

  return (
    <form action={formAction} className="mt-3">
      {parentId && <input type="hidden" name="parent_id" value={parentId} />}
      {/* 허니팟(사람에겐 숨김) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-wrap gap-2">
        <input
          name="nickname"
          aria-label="닉네임"
          autoComplete="off"
          placeholder="닉네임"
          maxLength={20}
          required
          autoFocus={autoFocus}
          className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <input
          name="body"
          aria-label={parentId ? '답글' : '댓글'}
          placeholder={parentId ? '답글을 입력하세요' : '댓글을 입력하세요'}
          maxLength={500}
          required
          className="min-w-0 flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-teal hover:bg-teal-600 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
        >
          {pending ? '등록 중…' : '등록'}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-ink-soft rounded-full border border-black/10 px-4 py-2 text-sm transition-colors hover:bg-black/[0.03]"
          >
            취소
          </button>
        )}
      </div>
      {state.error && <p role="alert" className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  )
}

function CommentItem({
  comment,
  postId,
  depth,
}: {
  comment: CommentNode
  postId: string
  depth: number
}) {
  const [replying, setReplying] = useState(false)

  return (
    <li className={depth > 0 ? 'border-line ml-5 border-l pl-4 sm:ml-8' : ''}>
      <div className="py-3">
        <div className="flex items-center gap-2">
          <span className="text-ink text-sm font-semibold">{comment.nickname}</span>
          <button
            type="button"
            onClick={() => setReplying((v) => !v)}
            className="text-teal text-xs font-medium hover:underline"
          >
            답글
          </button>
        </div>
        <p className="text-ink mt-1 whitespace-pre-wrap text-sm leading-relaxed">
          {comment.body}
        </p>
        {replying && (
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onDone={() => setReplying(false)}
            autoFocus
          />
        )}
      </div>
      {comment.children.length > 0 && (
        <ul>
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} postId={postId} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

// 댓글 영역: 목록(중첩) + 새 댓글 폼
export default function Comments({
  postId,
  comments,
}: {
  postId: string
  comments: CommentNode[]
}) {
  const count = (nodes: CommentNode[]): number =>
    nodes.reduce((sum, n) => sum + 1 + count(n.children), 0)

  return (
    <section className="border-line mt-10 border-t pt-6">
      <h2 className="text-ink text-lg font-bold">
        답글 <span className="text-teal">({count(comments)})</span>
      </h2>

      {comments.length > 0 && (
        <ul className="divide-line mt-2 divide-y">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} depth={0} />
          ))}
        </ul>
      )}

      <CommentForm postId={postId} />
    </section>
  )
}
