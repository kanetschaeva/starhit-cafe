function App() {
  return (
    <main className="min-h-screen bg-[#F7F2EA] px-5 py-10 font-sans text-[#49362B]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest">
            StarHit Cafe
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Кофе под твоё настроение
          </h1>
          <p className="mt-3 text-[#756457]">
            Начнём с любимой классики.
          </p>
        </header>

        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex h-44 items-center justify-center rounded-2xl bg-[#CDE8DD]">
            <span className="text-7xl" role="img" aria-label="Чашка кофе">
              ☕
            </span>
          </div>

          <h2 className="mt-5 text-2xl font-bold">Капучино</h2>
          <p className="mt-2 leading-relaxed text-[#756457]">
            Эспрессо, тёплое молоко и нежная молочная пена.
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-[#756457]">300 мл</span>
            <span className="text-xl font-bold">250 ₽</span>
          </div>
        </article>

        <p className="mt-5 text-center text-xs text-[#756457]">
          Учебный проект · Напиток и цена для демонстрации
        </p>
      </div>
    </main>
  )
}

export default App