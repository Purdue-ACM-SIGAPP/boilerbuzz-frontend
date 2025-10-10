const Images = {
  // top-level images
  profile: require("./profile.png"),
  icon: require("./icon.png"),

  // navbar icons
  home: require("./navbar_icons/home.png"),
  home_pressed: require("./navbar_icons/home_pressed.png"),
  search: require("./navbar_icons/search.png"),
  podium: require("./navbar_icons/podium.png"),
  thumbtack: require("./navbar_icons/thumbtack.png"),
  user: require("./navbar_icons/user.png"),

  // add more groups/entries here...
} as const;

export type ImagesType = typeof Images;
export default Images;
