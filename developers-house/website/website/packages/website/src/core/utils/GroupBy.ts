export function groupBy<T, TR> (
    array: T[],
    parameter: (value: T) => TR
): Map<TR, T[]> {
    const ret: Map<TR, T[]> = new Map<TR, T[]>();
    array.forEach((value) => {
        const identifier = parameter(value);
        ret.set(identifier, [...(ret.get(identifier) || []), value]);
    });
    return ret;
}
