import chalk from "chalk";

// Background colors
export const bgBlue = chalk.bgRgb(52, 158, 219);
export const bgCyan = chalk.bgRgb(26, 188, 156);
export const bgGreen = chalk.bgRgb(46, 204, 113);
export const bgPurple = chalk.bgRgb(142, 68, 173);
export const bgRed = chalk.bgRgb(231, 76, 60);
export const bgWhite = chalk.bgRgb(236, 240, 241);
export const bgYellow = chalk.bgRgb(241, 196, 15);

// Text colors
export const txBlue = chalk.rgb(52, 152, 219);
export const txCyan = chalk.rgb(26, 188, 156);
export const txGreen = chalk.rgb(46, 204, 113);
export const txPurple = chalk.rgb(142, 68, 173);
export const txRed = chalk.rgb(231, 76, 60);
export const txWhite = chalk.rgb(236, 240, 241);
export const txYellow = chalk.rgb(241, 196, 15);

console.log(txCyan("Hello, I’m a Yellow string"));
