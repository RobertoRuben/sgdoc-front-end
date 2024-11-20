import { ReactNode } from 'react';

type MainContentProps = {
    children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
    console.log("Depuración: Renderizando MainContent.");
    return (
        <main
            className="flex-1 p-6 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-transparent scrollbar-track-transparent">
            {children}
        </main>

    );
}