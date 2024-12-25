export default function Contact() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-5xl">
          Contact page 
        </h1>
        <p className="text-lg text-center sm:text-xl">
          If you have any questions or concerns, please feel free to reach out
          to us at <a href="mailto: "></a>
        </p>
      </main>
    </div>
  );
}
