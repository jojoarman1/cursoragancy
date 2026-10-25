import clsx from 'clsx'

// Different speeds per property: the blur clears well before the move settles
const TRANSITION_CLASS_NAME =
  '[transition:translate_0.75s_var(--ease-roll),scale_0.75s_var(--ease-roll),filter_0.4s_var(--ease-roll)] motion-reduce:transition-none'

interface RollingLabelProps {
  label: string
}

// Hover as on supersolid.agency, in plain CSS on the parent `group`: the label rises out and blurs
// while its copy rises in from below, growing from 85% and sharpening. CSS transitions turn around
// from wherever they are, so a quick leave reverses smoothly
export const RollingLabel = ({ label }: RollingLabelProps) => (
  <span aria-hidden='true' className='relative whitespace-pre [clip-path:inset(0_-50%)]'>
    <span
      className={clsx(
        'block group-hover:translate-y-[-120%] group-hover:blur-[3px] group-focus-visible:translate-y-[-120%] group-focus-visible:blur-[3px]',
        TRANSITION_CLASS_NAME
      )}
    >
      {label}
    </span>
    <span
      className={clsx(
        'absolute inset-0 origin-bottom translate-y-[110%] scale-[0.85] blur-[3px] group-hover:translate-y-0 group-hover:scale-100 group-hover:blur-none group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:blur-none',
        TRANSITION_CLASS_NAME
      )}
    >
      {label}
    </span>
  </span>
)
