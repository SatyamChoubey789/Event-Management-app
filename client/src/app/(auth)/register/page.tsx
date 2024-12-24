export default function Register(){
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-center sm:text-5xl">
                    Register
                </h1>
                <p className="text-lg text-center sm:text-xl">
                    This is the registration page. Here you can create a new account. You can
                    register as a student, teacher, or parent. You can also log in if you already
                    have an account. If you need help with registration, we are here to help!
                </p>
            </main>
        </div>
    );
}