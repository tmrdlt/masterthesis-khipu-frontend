export type Item = {
    id: string;
    description: string;
}
export type List = {
    id: string;
    title: string,
    children: Array<Item>
}
