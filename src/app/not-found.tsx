export default function NotFound() {
  return (
    <main className='flex min-h-dvh flex-col items-center justify-center'>
      <div className='flex w-[90%] flex-1 flex-col items-start justify-between py-[5%] max-md:w-[85%] max-md:py-[10%]'>
        <p className='font-mono text-base leading-normal tracking-[1px] uppercase'>404</p>
        <div className='my-15 max-w-145'>
          <h1 className='mb-[0.4em] text-[calc(50*var(--text-unit))] leading-[1.1] font-medium tracking-[-0.02em] max-md:text-[calc(36*var(--text-unit))] max-lg:text-[calc(32*var(--text-unit))]'>
            Страница не найдена
          </h1>
          <p className='text-[calc(18*var(--text-unit))] leading-[1.7]'>
            Страница, которую вы ищете, не существует или была перемещена.
          </p>
        </div>
        {/* Keeps the message vertically centered */}
        <div />
      </div>
    </main>
  )
}
