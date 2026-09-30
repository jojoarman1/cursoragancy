'use client'

import { useCursorFollower } from '@/hooks/useCursorFollower'

export const CursorFollower = () => {
  const cursorFollower = useCursorFollower()

  if (!cursorFollower.state.isEnabled) return null

  return (
    <div
      ref={cursorFollower.refs.followerRef}
      aria-hidden='true'
      className='pointer-events-none invisible fixed top-0 left-0 z-50 size-4 rounded-full bg-white shadow-[inset_0_0_0_1px_white] mix-blend-difference'
    />
  )
}
