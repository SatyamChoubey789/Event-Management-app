

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-5xl">
          Welcome to the <span className="text-indigo-500">Event</span> Management System!
        </h1>
        <p className="text-lg text-center sm:text-xl">
          Get started by creating an account or logging in.
          </p>
        <div className="flex flex-col gap-4">
          <a href="/register" className="btn btn-primary">
            Register
          </a>
          <a href="/login" className="btn btn-secondary">
            Login
          </a>
        </div>
      </main>
    </div>
  );
}
