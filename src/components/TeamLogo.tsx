import React, { FC } from "react";

interface ITeamLogoProps {
  team: string;
}

export const TeamLogo: FC<ITeamLogoProps> = ({ team }) => (
  <div
    className={`team-logo logo-${team
      .replace(/\s+/g, "")
      .replace(/&/g, "")
      .replace(/\./g, "")}`}
  ></div>
);
