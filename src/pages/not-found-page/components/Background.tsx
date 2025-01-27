export const Background = () => {
    return (
        <>
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
            <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl opacity-70" />
        </>
    );
};