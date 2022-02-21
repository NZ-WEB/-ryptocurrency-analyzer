module.exports = {
    purge: { content: ["./public/**/*.htm", "./src/**/*.vue"] },
    darkMode: false,
    theme: {
        // ...
    },
    plugins: [require("@tailwindcss/forms")],
};