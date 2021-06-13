interface RouteWithOnlyContent {
  navbarBlacklist: string[];
}

const routeWithOnlyContent: RouteWithOnlyContent = {
  navbarBlacklist: ["/callback", "/auth/login"],
};

export default routeWithOnlyContent;
