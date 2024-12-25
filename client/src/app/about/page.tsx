export default function About() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-5xl">
            About page
            </h1>
            <p className="text-lg text-center sm:text-xl">
            We are a team of developers who have come together to create a
            platform for managing events. Our goal is to make event management
            easier and more accessible to everyone. We hope you enjoy using our
            platform!
            </p>
        </main>
        </div>
    );
};