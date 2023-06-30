if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
    console.log(1);
    document.documentElement.classList.add('dark');
} else {
    console.log(2);
    document.documentElement.classList.remove('dark');
}
