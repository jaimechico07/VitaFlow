export const getRandomColor = () => {
    const colors = [
        'text-green-500',
        'text-purple-500',
        'text-pink-500',
        'text-orange-500',
        'text-cyan-500',
        'text-teal-500',
        'text-indigo-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};