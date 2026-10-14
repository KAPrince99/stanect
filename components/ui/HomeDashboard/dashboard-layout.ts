/** Dashboard column. Marker class keeps All/Favorites on the same board as the cards. */
export const DASHBOARD_BOARD = "dashboard-board mx-auto w-full max-w-4xl";

/**
 * Left edge of the search magnifier inside the search capsule.
 * Continue-strip avatar and the nav logo share this inset.
 */
export const DASHBOARD_SEARCH_PAD_X = "px-4 sm:px-5";
export const DASHBOARD_ALIGN_SEARCH_ICON = "pl-4 sm:pl-5";
/** Continue avatar sits slightly left of the magnifier, not flush to the board. */
export const DASHBOARD_CONTINUE_AVATAR_INSET = "pl-2 sm:pl-3";

/** Same columns and gaps as the companion card grid. */
export const DASHBOARD_CARD_GRID =
  "grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3";

/**
 * One card column: 2-col + gap-3, sm 2-col + gap-6, lg 3-col + gap-6.
 * All/Favorites nest uses this width; m-1.5 insets it uniformly from the
 * outer search capsule.
 */
export const DASHBOARD_ONE_CARD_WIDTH = "dashboard-one-card";

export const DASHBOARD_RESULTS_ID = "dashboard-companion-results";

/**
 * Space under the search row, matching the gap from the nav pill to the
 * continue strip: page pt-24/lg:pt-28 minus nav pt-4 and pill h-14/sm:h-16.
 */
export const DASHBOARD_BELOW_SEARCH = "mb-6 sm:mb-4 lg:mb-8";
