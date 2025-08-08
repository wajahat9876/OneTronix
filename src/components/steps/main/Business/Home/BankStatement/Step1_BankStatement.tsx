/* eslint-disable react/no-this-in-sfc */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */

import ScreenAuth from "@src/components/globals/ScreenAuth";
import Colors from "@src/constants/Colors";
import React from "react";
import { BankStatementProps } from "./type";

const Step1_BankStatement = ({ parentGoto }: BankStatementProps) => {
  return (
    <ScreenAuth
      title="E-Statements"
      style={{
        backgroundColor: "white",
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        parentGoto?.(0);
      }}
    ></ScreenAuth>
  );
};

export default Step1_BankStatement;
