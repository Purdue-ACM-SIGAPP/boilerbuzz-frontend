const Images = {
  // top-level images
  profile: require("./profile.png"),
  icon: require("./icon.png"),

  // navbar icons
  home: require("./navbar_icons/home.png"),
  home_pressed: require("./navbar_icons/home_pressed.png"),
  search: require("./navbar_icons/search.png"),
  search_pressed: require("./navbar_icons/search_pressed.png"),
  podium: require("./navbar_icons/podium.png"),
  podium_pressed: require("./navbar_icons/podium_pressed.png"),
  thumbtack: require("./navbar_icons/thumbtack.png"),
  thumbtack_pressed: require("./navbar_icons/thumbtack_pressed.png"),
  user: require("./navbar_icons/user.png"),
  user_pressed: require("./navbar_icons/user_pressed.png"),
  add: require("./navbar_icons/add.png"),
  add_pressed: require("./navbar_icons/add_pressed.png"),

  // poster icons
  comment: require("./post_icons/comment.png"),
  favorite: require("./post_icons/favorite.png"),
  send: require("./post_icons/send.png"),
  pin: require("./navbar_icons/thumbtack.png"),
  toEvent: require("./post_icons/to_event.png"),

  cross: require("./cross.png"),
} as const;

export type ImagesType = typeof Images;
export default Images;
