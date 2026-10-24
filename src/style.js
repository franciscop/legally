const styles = {
  thin: Object.assign(
    [
      ["┌", "┬", "┐"],
      ["├", "┼", "┤"],
      ["└", "┴", "┘"],
    ],
    { h: "─", v: "│" },
  ),
  bold: Object.assign(
    [
      ["┏", "┳", "┓"],
      ["┣", "╋", "┫"],
      ["┗", "┻", "┛"],
    ],
    { h: "━", v: "┃" },
  ),
  double: Object.assign(
    [
      ["╔", "╦", "╗"],
      ["╠", "╬", "╣"],
      ["╚", "╩", "╝"],
    ],
    { h: "═", v: "║" },
  ),
  ascii: Object.assign(
    [
      ["+", "+", "+"],
      ["+", "+", "+"],
      ["+", "+", "+"],
    ],
    { h: "-", v: "|" },
  ),
};

export default (border) => styles[border] || styles.thin;
