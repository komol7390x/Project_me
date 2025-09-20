export function toSkipTake(page: number = 1, limit: number = 100): {skip:number,take:number} {
    const take = Math.min(Math.max(limit, 1), 100)
    const skip = (Math.max(page, 1) - 1) * take
    return { take, skip }
}