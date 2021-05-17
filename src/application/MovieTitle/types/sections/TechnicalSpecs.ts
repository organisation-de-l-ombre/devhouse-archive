interface Franchise {
  title: string;
  year?: string;
}

interface FranchiseGlobal {
  previous: Franchise;
  next: Franchise;
}

interface Presentation {
  movieLogo?: string;
  title: string;
  VOTitle?: string;
  originalCountry: string;
  duration?: string;
  type: string[];
  case: string;
  distributors: string[];
  productionStart?: string;
  productionRelease?: string;
  releaseDate?: string;
  budget?: string;
  boxOffice?: string;
  directors?: string[];
  producers?: string[];
  screenWriters?: string[];
  mainActors?: string[];
  movieChronologicalFranchise?: FranchiseGlobal;
  movieLogicalFranchise?: FranchiseGlobal;
}

interface MovieSpecs {
  movieFormat?: string[];
  cinematographicProcess?: string[];
  formatType?: string[];
  colorimetry?: string[];
  imageDefinition?: string[];
  soundDefinition?: string[];
  aspectRatio?: string[];
}

interface TechnicalSpecs {
  presentation: Presentation;
  movieSpecs?: MovieSpecs;
}

export { TechnicalSpecs };
