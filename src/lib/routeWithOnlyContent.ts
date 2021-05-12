interface RouteWithOnlyContent {
  navbarBlacklist: string[];
  footerBlacklist: string[];
}

const routeWithOnlyContent: RouteWithOnlyContent = {
  navbarBlacklist: ["/callback", "/auth/login"],
  footerBlacklist: ["/callback", "/auth/login", "/wiki/internal", "/account"],
};

export default routeWithOnlyContent;
