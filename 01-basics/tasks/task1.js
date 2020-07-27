process.stdin.on('data', (input) => {
    const trimmed = input.toString().trim();
    process.stdout.write(`${ [...trimmed].reverse().join('') }\n\n`);
});
