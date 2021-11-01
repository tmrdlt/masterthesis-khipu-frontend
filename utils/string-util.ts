export const capitalizeFirstLetter = (str: string): string => {
    const stringLower = str.toLowerCase()
    return stringLower.charAt(0).toUpperCase() + stringLower.slice(1);
}
