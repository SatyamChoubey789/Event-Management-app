export default function Admin(){
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-center sm:text-5xl">
                    Admin page
                </h1>
                <p className="text-lg text-center sm:text-xl">
                    This is the admin page. Here you can manage your events. You can
                    create new events, edit existing events, and delete events. You can
                    also view the list of events and search for events. If you need help
                    with managing your events, we are here to help!
                </p>
            </main>
        </div>
    );
}