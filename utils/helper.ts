export function fillTemplate(
    template: string,
    variables: Record<string, string>
): string {
    let output = template;
    for (const [key, value] of Object.entries(variables)) {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        output = output.replace(pattern, value);
    }
    return output;
}

export function tryParseJson<T = any>(input: string): T | null {
    if (!input) return null;

    let str = input.trim();

    // Case 1: If the whole string is quoted → unwrap it
    if (str.startsWith('"') && str.endsWith('"')) {
        str = str.slice(1, -1);
    }

    // Clean escaped quotes \" → "
    str = str.replace(/\\"/g, '"');

    // Only parse if string STARTS WITH '{'
    if (!str.trim().startsWith("{")) {
        return null;
    }

    try {
        return JSON.parse(str) as T;
    } catch (err) {
        console.error("Failed to parse JSON:", err);
        return null;
    }
}
