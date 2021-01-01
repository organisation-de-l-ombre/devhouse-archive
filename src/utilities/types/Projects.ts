/*
 * The projects api.
 */

type Project = {
    name: string;
    descriptionFile: string;
    simpleName: string; // Simplified version of a name like 'framer_api'
    icon: string; // Url of the avatar of the project.
};

type Projects = Project[];

export type {
    Projects
};
