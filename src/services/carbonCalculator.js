export const calculateCarbon = (transport, food) => {
  let carbon = 0;

  if (transport === "car") carbon += 2.5;
  else if (transport === "bus") carbon += 1.0;
  else if (transport === "bike") carbon += 0.5;
  else if (transport === "walk") carbon += 0;

  if (food === "meat") carbon += 2.0;
  else if (food === "vegetarian") carbon += 0.8;

  return carbon;
};