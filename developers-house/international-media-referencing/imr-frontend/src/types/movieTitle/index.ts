import { CastingSection } from "./sections/Casting";
import { GenericSection } from "./sections/GenericSection";
import { OSTSection } from "./sections/OST";
import { TechnicalSpecsSection } from "./sections/TechnicalSpecs";
import { VideosGlobalSection } from "./sections/Videos";
import { WatchSection } from "./sections/Watch";

// Modules
export * from "./sections/Watch";

// Global
export * from "./global/Summary";
export * from "./global/GenericSectionBody";
export * from "./global/MovieTitleParams";
export * from "./global/MovieTitleComponent";

// Sections
export * from "./sections/GenericSection";
export * from "./sections/Casting";
export * from "./sections/Videos";
export * from "./sections/OST";
export * from "./sections/TechnicalSpecs";
export type Section =
  | CastingSection
  | GenericSection
  | OSTSection
  | TechnicalSpecsSection
  | WatchSection
  | VideosGlobalSection;
