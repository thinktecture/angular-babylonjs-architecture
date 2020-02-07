export interface Pickable {
    enablePick(pickable: boolean);
}

export function isPickable(toCheck: any): toCheck is Pickable {
    return !!toCheck.enablePick;
}
