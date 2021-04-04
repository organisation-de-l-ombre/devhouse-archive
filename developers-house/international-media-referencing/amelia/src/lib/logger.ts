const getDate = (time: number): string => {
    const date: Date = new Date(time);
    const day: number | string = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const month: number | string = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const year: number | string = date.getFullYear();
    const hours: number | string = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes: number | string = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds: number | string = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const { reset, green, yellow, red } = {
    reset: '\u001b[0m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    red: '\u001b[31m'
};

export const logger = new class Logger {
    /**
     * Logs a message in the console with green color
     */
    info (...message: any[]): void {
        console.log(`${green}[${getDate(Date.now())}] ${message}${reset}`);
    }

    /**
     * Logs a message in the console with yellow color
     */
    warn (...message: any[]): void {
        console.log(`${yellow}[${getDate(Date.now())}] ${message}${reset}`);
    }

    /**
     * Logs a message in the console with red color
     */
    error (...message: any[]): void {
        console.log(`${red}[${getDate(Date.now())}] ${message}${reset}`);
    }
}();
