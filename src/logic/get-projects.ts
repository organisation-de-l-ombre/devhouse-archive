/**
 * @todo Change the memory store and put a real db.
 */
import { Projects } from "../../gen";

const inMemoryStore: Projects[] = [

];

async function getProjects (): Promise<Projects[]> {
    // TODO: Fetch from a typeorm db.
    return inMemoryStore;
}

export default getProjects;