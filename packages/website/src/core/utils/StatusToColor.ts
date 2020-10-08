const nameColor = {
    online: "rgb(67, 181, 129)",
    idle: "rgb(250, 166, 26)",
    dnd: "rgb(240, 71, 71)",
    offline: "gray"
};

export function statusToColor (
    name: "online" | "idle" | "dnd" | "offline"
): string {
    return nameColor[name] || nameColor.offline;
}
